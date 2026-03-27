from langgraph.graph import StateGraph, START, END
from typing import Literal
import pandas as pd
import aid_expertise_search.functions as aid_functions
from aid_expertise_search.clients import weak_client, medium_client, strong_client, answer_client, embedding_model
from aid_expertise_search.classes import MemoryState


"""

Application With Memory Between Each Search

"""

def Memory_GatherInformationNode(state: MemoryState) -> MemoryState:
    """
    Gathers relevant information to give better answer depending on the context given by the users query
    Same Logic as in the Non-Memory Graph
    """
    return aid_functions.information_node(state)

def Memory_SearchAndEvaluateNode(state: MemoryState) -> MemoryState:
    """
    Retrieves relevant articles, and tries to score the authors on relevance to the query
    """

    scientific_area = state.get('scientific_area')
    if scientific_area.specific_area.lower() == "other":
        query = state.get('query')[-1][1]
    else:
        query = state.get('scientific_area').specific_area

    vector = embedding_model.encode(query)

    df = aid_functions.load_dataframe('documents.pkl')

    cosine_retrieved_df = aid_functions.retrieval(df, vector = vector).sort_values(by='cosine', ascending=False)
    bm25_retrieved_df = aid_functions.bm25_retrieval(df, query=query, k = 10).sort_values(by='bm25', ascending=False)

    if len(cosine_retrieved_df):

        max_cosine = max(cosine_retrieved_df['cosine'])
        max_bm25 = max(bm25_retrieved_df['bm25'])
        
        cosine_retrieved_df['score'] = cosine_retrieved_df['cosine']
        bm25_retrieved_df['score'] = bm25_retrieved_df['bm25'].apply(lambda x: x*max_cosine/max_bm25)
        
        cosine_relevance_score = aid_functions.gather_relevance_score(cosine_retrieved_df, square = True)
        bm25_relevance_score = aid_functions.gather_relevance_score(bm25_retrieved_df, square = False)

        authors_relevance_score = {}
        top_score_bm25 = max(bm25_relevance_score.values())
        top_score_cosine = max(cosine_relevance_score.values())
        for a in set(list(bm25_relevance_score.keys())+list(cosine_relevance_score)):
            authors_relevance_score[a] = cosine_relevance_score.get(a,0)/top_score_cosine + bm25_relevance_score.get(a,0)/top_score_bm25

        cosine_index_to_score = {}
        for index, score in zip(cosine_retrieved_df['index'], cosine_retrieved_df['score']):
            cosine_index_to_score[index] = score

        bm25_index_to_score = {}
        for index, score in zip(bm25_retrieved_df['index'], bm25_retrieved_df['score']):
            bm25_index_to_score[index] = score

        df['score'] = df['index'].apply(lambda x: cosine_index_to_score.get(x,0)+bm25_index_to_score.get(x,0))
        retrieved_df = df[df['score'].apply(lambda x: x>0)].sort_values(by = 'score', ascending=False)

        total_retrieved_df = pd.concat([retrieved_df.head(5), state.get('total_retrieved_df')]).drop_duplicates(subset=["title"], keep="first")
        relevant_researchers = sorted(authors_relevance_score.items(), key = lambda researcher_tuple: researcher_tuple[1], reverse=True)[:5]

        if relevant_researchers:
            most_relevant_researchers = [relevant_researchers[0][0]]
            best_score = relevant_researchers[0][1]
            for researcher, score in relevant_researchers[1:]:
                if score > best_score*2/3:
                    most_relevant_researchers.append((researcher, score))
                else:
                    break
        else:
            most_relevant_researchers = []

        return {"score": authors_relevance_score, "retrieved_df": retrieved_df, "total_retrieved_df": total_retrieved_df, "most_relevant_researchers": relevant_researchers}
    else:
        return {}

def Memory_AnswerNode(state: MemoryState) -> MemoryState:
    """
    Produces Text answer to reply the user
    """
    context = "\n\n" + "-"*40
    retrieved_df = state.get('total_retrieved_df', pd.DataFrame())
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
            Context:{context}"""}]
    
    msg.extend([{"role": messager, "content": content} for messager, content in state.get('query')])

    text_answer = answer_client.invoke(msg).content
    most_relevant_researchers = state.get("most_relevant_researchers",[])
    
    general_researcher_information = []

    mentioned_researchers = aid_functions.find_mentioned_researchers(text_answer, most_relevant_researchers, mode = 'mentioned_aid_list')
    retrieved_df = state.get('retrieved_df')

    for researcher in mentioned_researchers:
        context = "\n\n" + "-"*40
        relevant_df = retrieved_df[retrieved_df['name'] == researcher]
        n = len(relevant_df)
        for article_text, name, i in zip(relevant_df['full_text'], relevant_df['name'], range(n)):
            context += "\n Document Information (only first 2000 letters added)\n---------\n"
            context += article_text[:2000]
            if i != n-1:
                context += "\n\n" + "-"*20 + "NEXT DOCUMENT" + "-"*20 + "\n\n"

        msg = [{"role": "system", "content": f"""
                You are going to state why the researcher {researcher} is relevant to the users query, please provide some background here. 
                Do not try and solve the users problem. Your answer should be a short paragraph.
                The context is the first 2000 letters of relevant articles made by {researcher}
                Context:{context}"""}]
        
        msg.extend([{"role": messager, "content": content} for messager, content in state.get('query')])

        researcher_answer = medium_client.invoke(msg).content
        general_researcher_information.append((researcher, researcher_answer))

    return {"text_answer": text_answer, "general_researcher_information": general_researcher_information}

def Memory_ResearcherInformationNode(state: MemoryState) -> MemoryState:
    """
    Returns DataFrame with articles by researchers mentioned in the query
    """
    df = aid_functions.load_dataframe('documents.pkl')
    return{'retrieved_df': df[df['name'].isin(state.get('researchers'))], 'score': {}}

"""
Routers
"""

def Memory_InformationRouter(state: MemoryState) -> Literal["SearchAndEvaluateNode", "ResearcherInformationNode"]:
    if state.get('researchers'):
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
memory_graph_builder.add_conditional_edges("GatherInformationNode", Memory_InformationRouter, {"ResearcherInformationNode": "ResearcherInformationNode", "SearchAndEvaluateNode": "SearchAndEvaluateNode"})
memory_graph_builder.add_edge("SearchAndEvaluateNode", "AnswerNode")
memory_graph_builder.add_edge("ResearcherInformationNode", "AnswerNode")
memory_graph_builder.add_edge("AnswerNode", END)

memory_program = memory_graph_builder.compile()

def memory_invoke_graph(state: MemoryState) -> MemoryState:
    """
    Invoke the graph
    """
    return memory_program.invoke(state)

def memory_stream_graph(state: MemoryState) -> MemoryState:
    """
    Stream the graph
    """
    print("AI: ", end = "", flush=True)
    latest_state = None
    for mode, chunk in memory_program.stream(state, stream_mode=["messages", "values"]):
        if mode == "messages":
            msg, metadata = chunk
            if "tags" in metadata.keys():
                if metadata["tags"] == ["answer"]:
                    print(msg.content, end = "", flush=True)
        else:
            latest_state = chunk
    print("")
    return latest_state