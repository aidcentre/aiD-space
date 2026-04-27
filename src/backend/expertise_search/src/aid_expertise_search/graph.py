from langgraph.graph import StateGraph, START, END
from typing import Literal
import aid_expertise_search.functions as aid_functions
from aid_expertise_search.clients import weak_client, medium_client, strong_client
import aid_expertise_search.clients as _clients
from aid_expertise_search.classes import State

"""
Application With No Memory Between Each Search
"""

"""
Nodes
"""

def GatherInformationNode(state: State) -> State:
    """
    Gathers relevant information to give better answer depending on the context given by the users query
    Same Logic as in the Memory Graph
    """
    return aid_functions.information_node(state)

def SearchAndEvaluateNode(state: State) -> State:
    """
    Retrieves relevant articles, and tries to score the authors on relevance to the query
    """

    scientific_area = state.get('scientific_area')
    if scientific_area.specific_area.lower() == "other":
        vector = _clients.embedding_model.encode(state.get('query'))
    else:
        vector = _clients.embedding_model.encode(state.get('scientific_area').specific_area)

    retrieved_df = aid_functions.retrieval(df = aid_functions.load_dataframe('documents.pkl'), vector = vector).sort_values(by='cosine', ascending=False)

    authors_article_score  = {}
    authors_total_n_papers  = {}
    authors_relevance_score = {}

    authors_set = set()

    for a in retrieved_df['name'].tolist():
        authors_total_n_papers[a] = authors_total_n_papers.get(a, 0) + 1

    for a, score in zip(retrieved_df['name'], retrieved_df['cosine']):
        authors_set.add(a)
        authors_article_score[a] = authors_article_score.get(a, 0) + (1+score)**2-1
    
    max_n_papers = 0
    for a in authors_set:
        if authors_total_n_papers[a] > max_n_papers:
            max_n_papers = authors_total_n_papers[a]

    gamma = 0.5

    for a in authors_set:
        authors_relevance_score[a] = 100*authors_article_score[a]/(authors_total_n_papers[a]*max_n_papers)**gamma

    return {"score": authors_relevance_score, "retrieved_df": retrieved_df.head(5)}

def AnswerNode(state: State) -> State:
    """
    Produces Text answer to reply the user
    """
    context = "\n\n" + "-"*40
    retrieved_df = state.get('retrieved_df')
    n = len(retrieved_df)
    for article_text, name, i in zip(retrieved_df['full_text'], retrieved_df['name'], range(n)):
        context += f"Researcher: {name.replace("_"," ")}"
        context += "\n Document Information (only first 2000 letters added)\n---------\n"
        context += article_text[:2000]
        if i != n-1:
            context += "\n\n" + "-"*20 + "NEXT DOCUMENT" + "-"*20 + "\n\n"

    msg = [{"role": "system", "content": f"""
            You are going to guide the user to the Researchers best suited to help with their problem.
            State which researcers have relevant context related to the users query.
            You should only mention the authors presented in the 'Researcher: <name_of_researcher>'.
            Do not try and solve the users problem. Your answer should be a short paragraph.
            Context:{context}"""}, {"role":"user", "content": state.get('query')}]
    
    text_answer = medium_client.invoke(msg).content
    return {"text_answer": text_answer}

def ResearcherInformationNode(state: State) -> State:
    """
    Returns DataFrame with articles by researchers mentioned in the query
    """
    df = aid_functions.load_dataframe('documents.pkl')
    return{'retrieved_df': df[df['name'].isin(state.get('researchers'))], 'score': {}}

"""
Routers
"""

def InformationRouter(state: State) -> Literal["SearchAndEvaluateNode", "ResearcherInformationNode"]:
    if state.get('researchers'):
        return "ResearcherInformationNode"
    else:
        return "SearchAndEvaluateNode"

"""
Build Graph
"""

graph_builder = StateGraph(State)
graph_builder.add_node("GatherInformationNode", GatherInformationNode)
graph_builder.add_node("ResearcherInformationNode", ResearcherInformationNode)
graph_builder.add_node("SearchAndEvaluateNode", SearchAndEvaluateNode)
graph_builder.add_node("AnswerNode", AnswerNode)

graph_builder.add_edge(START, "GatherInformationNode")
graph_builder.add_conditional_edges("GatherInformationNode", InformationRouter, {"ResearcherInformationNode": "ResearcherInformationNode", "SearchAndEvaluateNode": "SearchAndEvaluateNode"})
graph_builder.add_edge("SearchAndEvaluateNode", "AnswerNode")
graph_builder.add_edge("ResearcherInformationNode", "AnswerNode")
graph_builder.add_edge("AnswerNode", END)

program = graph_builder.compile()

def invoke_graph(state: State) -> State:
    """
    Invoke the graph
    """
    print("Invoking Graph!")
    return program.invoke(state)