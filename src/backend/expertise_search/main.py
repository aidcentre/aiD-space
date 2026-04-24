from fastapi import FastAPI
from pydantic import BaseModel
from aid_expertise_search import memory_graph
from aid_expertise_search.classes import MemoryState

app = FastAPI()


@app.get("/")
async def testing_something():
    return {"message": "heloo world is this working?"}


# this variable persists across all requests
total_retrieved_df = None


class LLMResponse(BaseModel):
    text_answer: str
    most_relevant_researchers: list[tuple[str, float]]
    general_researcher_information: list[tuple[str, str]]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


@app.post("/")
async def get_llm_response(body: ChatRequest) -> LLMResponse:
    global total_retrieved_df

    # for each message in chat history, format with role and content
    formatted_messages = [
        ("user" if msg.role == "user" else "ai", msg.content) for msg in body.messages
    ]

    # invoke the graph such that fields are easily retreivable later
    state = memory_graph.memory_stream_graph(
        MemoryState(query=formatted_messages, total_retrieved_df=total_retrieved_df)
    )
    total_retrieved_df = state.get("total_retrieved_df")

    return LLMResponse(
        text_answer=state.get("text_answer"),
        most_relevant_researchers=state.get("most_relevant_researchers", []),
        general_researcher_information=state.get("general_researcher_information", []),
    )
