from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def get_researchers(query:str):
    # total_retrieved_df = None
    # state = memory_graph.memory_stream_graph(MemoryState(query=query, total_retrieved_df=total_retrieved_df))
    # total_retrieved_df= state.get('total_retrieved_df')
    # general_researcher_information = state.get('general_researcher_information', [])
    # ai_response = state.get('text_answer')

    return {"message": query}
