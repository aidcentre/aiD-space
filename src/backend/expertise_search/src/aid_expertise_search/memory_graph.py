"""
The graph behind the FastAPI backend.

Differs from the original in two ways:

  * Retrieval hits Cosmos DB (hybrid vector + BM25 via RRF) instead of sweeping
    an in-memory pandas DataFrame and a local bm25s index.
  * There is no server-side conversation memory. The old `total_retrieved_df`
    accumulated retrieved documents across turns in a module global, which was
    shared by every concurrent user and could not survive more than one ACA
    replica. Retrieval now runs fresh each turn against the client-supplied
    history, so the process holds nothing between requests.
"""

import re
from typing import Literal

from langgraph.graph import StateGraph, START, END

import aid_expertise_search.functions as aid_functions
from aid_expertise_search import clients, retrieval
from aid_expertise_search.classes import MemoryState
from aid_expertise_search.config import settings

# The answering prompt has always used only the opening slice of each document.
_CONTEXT_CHARS = 2000

# Markers that the model failed to pin down a scientific field. The prompt asks
# for the literal word "other", but models phrase the fallback freely
# ("Unclear (insufficient context)", "Unknown", "N/A"), and embedding that text
# as the search query retrieves noise. Anything matching here falls back to the
# user's own words instead.
#
# Matched on word boundaries: a substring test would flag legitimate fields
# such as "nonequilibrium thermodynamics" on "none".
_UNSPECIFIC_PATTERN = re.compile(
    r"\b(other|unclear|unknown|unspecified|none|not\s+\w+|n/?a)\b", re.IGNORECASE
)
# Long enough for a descriptive field with examples, short enough to reject a
# hedging sentence that slipped past the markers.
_MAX_AREA_CHARS = 140


def _is_unspecific(area: str) -> bool:
    stripped = area.strip()
    if not stripped or len(stripped) > _MAX_AREA_CHARS:
        return True
    return bool(_UNSPECIFIC_PATTERN.search(stripped))


def Memory_GatherInformationNode(state: MemoryState) -> MemoryState:
    """
    Gathers relevant information to give better answer depending on the context given by the users query
    """
    return aid_functions.information_node(state)


def Memory_SearchAndEvaluateNode(state: MemoryState) -> MemoryState:
    """
    Retrieves relevant documents from Cosmos and scores researchers on relevance.
    """
    raw_query = state.get("query")[-1][1]

    scientific_area = state.get("scientific_area")
    if scientific_area and not _is_unspecific(scientific_area.specific_area):
        query = scientific_area.specific_area
    else:
        query = raw_query

    vector = clients.encode(query)
    # Relevance is judged on the user's own words, not the rewritten field —
    # see retrieval.search for why.
    gate_vector = vector if query == raw_query else clients.encode(raw_query)
    result = retrieval.search(query, vector, gate_vector=gate_vector)

    if result.is_empty:
        return {"documents": [], "score": {}, "most_relevant_researchers": []}

    relevant_researchers = retrieval.top_researchers(result.researcher_scores, limit=5)

    return {
        "score": result.researcher_scores,
        "documents": result.documents[: settings.context_documents],
        "most_relevant_researchers": relevant_researchers,
    }


def Memory_ResearcherInformationNode(state: MemoryState) -> MemoryState:
    """
    Returns the documents authored by researchers named in the query.
    """
    documents = retrieval.documents_for_researchers(state.get("researchers", []))
    return {"documents": documents, "score": {}, "most_relevant_researchers": []}


def _format_context(documents, include_names: bool) -> str:
    context = "\n\n" + "-" * 40
    n = len(documents)
    for i, doc in enumerate(documents):
        if include_names:
            context += f"Researcher: {doc.name.replace('_', ' ')}"
        context += "\n Document Information (only first 2000 letters added)\n---------\n"
        context += "\n".join(doc.snippets)[:_CONTEXT_CHARS]
        if i != n - 1:
            context += "\n\n" + "-" * 20 + "NEXT DOCUMENT" + "-" * 20 + "\n\n"
    return context


def Memory_AnswerNode(state: MemoryState) -> MemoryState:
    """
    Produces the text answer, plus a per-researcher justification.
    """
    documents = state.get("documents") or []

    if not documents:
        return {
            "text_answer": (
                "I could not find any AID research that matches that question. "
                "Try rephrasing it, or naming a specific research area."
            ),
            "general_researcher_information": [],
        }

    context = _format_context(documents, include_names=True)

    msg = [
        {
            "role": "system",
            "content": f"""
            You are going to guide the user to the Researchers best suited to help with their problem.
            State which researcers have relevant context related to the users query.
            You should only mention the authors presented in the 'Researcher: <name_of_researcher>'.
            Do not try and solve the users problem. Your answer should be a short paragraph.
            Context:{context}""",
        }
    ]
    msg.extend(
        [{"role": messager, "content": content} for messager, content in state.get("query")]
    )

    text_answer = clients.answer_client.invoke(msg).content
    most_relevant_researchers = state.get("most_relevant_researchers", [])

    mentioned_researchers = aid_functions.find_mentioned_researchers(
        text_answer, most_relevant_researchers, mode="mentioned_aid_list"
    )

    general_researcher_information = []
    for researcher in mentioned_researchers:
        researcher_docs = [d for d in documents if d.name == researcher]
        if not researcher_docs:
            continue
        researcher_context = _format_context(researcher_docs, include_names=False)

        msg = [
            {
                "role": "system",
                "content": f"""
                You are going to state why the researcher {researcher} is relevant to the users query, please provide some background here.
                Do not try and solve the users problem. Your answer should be a short paragraph.
                The context is the first 2000 letters of relevant articles made by {researcher}
                Context:{researcher_context}""",
            }
        ]
        msg.extend(
            [
                {"role": messager, "content": content}
                for messager, content in state.get("query")
            ]
        )

        researcher_answer = clients.medium_client.invoke(msg).content
        general_researcher_information.append((researcher, researcher_answer))

    return {
        "text_answer": text_answer,
        "general_researcher_information": general_researcher_information,
    }


"""
Routers
"""


def Memory_InformationRouter(
    state: MemoryState,
) -> Literal["SearchAndEvaluateNode", "ResearcherInformationNode"]:
    if state.get("researchers"):
        return "ResearcherInformationNode"
    else:
        return "SearchAndEvaluateNode"


"""
Build Graph
"""

memory_graph_builder = StateGraph(MemoryState)
memory_graph_builder.add_node("GatherInformationNode", Memory_GatherInformationNode)
memory_graph_builder.add_node("ResearcherInformationNode", Memory_ResearcherInformationNode)
memory_graph_builder.add_node("SearchAndEvaluateNode", Memory_SearchAndEvaluateNode)
memory_graph_builder.add_node("AnswerNode", Memory_AnswerNode)

memory_graph_builder.add_edge(START, "GatherInformationNode")
memory_graph_builder.add_conditional_edges(
    "GatherInformationNode",
    Memory_InformationRouter,
    {
        "ResearcherInformationNode": "ResearcherInformationNode",
        "SearchAndEvaluateNode": "SearchAndEvaluateNode",
    },
)
memory_graph_builder.add_edge("SearchAndEvaluateNode", "AnswerNode")
memory_graph_builder.add_edge("ResearcherInformationNode", "AnswerNode")
memory_graph_builder.add_edge("AnswerNode", END)

memory_program = memory_graph_builder.compile()


def memory_invoke_graph(state: MemoryState) -> MemoryState:
    """
    Invoke the graph.
    """
    return memory_program.invoke(state)
