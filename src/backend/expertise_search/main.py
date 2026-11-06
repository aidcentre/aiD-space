import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Header, HTTPException, status
from pydantic import BaseModel, Field

from aid_expertise_search import memory_graph
from aid_expertise_search.classes import MemoryState
from aid_expertise_search.clients import load_models
from aid_expertise_search.config import settings

logger = logging.getLogger("aid.backend")
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    if not settings.backend_api_key:
        logger.warning("BACKEND_API_KEY is unset — the API is unauthenticated")
    yield


app = FastAPI(title="AID expertise search", lifespan=lifespan)


def require_api_key(x_api_key: str | None) -> None:
    """
    Shared-secret check. The SvelteKit /chat proxy adds the header server-side,
    so it never reaches the browser. Skipped entirely when no key is
    configured, which is the local development case.
    """
    if not settings.backend_api_key:
        return
    if x_api_key != settings.backend_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid or missing API key"
        )


@app.get("/health")
async def health():
    """Liveness probe for Azure Container Apps. Unauthenticated by design."""
    return {"status": "ok"}


class RelevantDocument(BaseModel):
    """
    One retrieved document, surfaced so the frontend can show the article
    behind an answer instead of only the researcher who wrote it.

    `doc_id` is the join key, but it is positional (assigned by enumeration
    order at ingest time), so a re-ingest can rebind it to a different paper.
    `name` + `title` are carried alongside it as a content-derived fallback.
    """

    doc_id: str
    title: str
    name: str
    score: float
    similarity: float


class LLMResponse(BaseModel):
    text_answer: str
    most_relevant_researchers: list[tuple[str, float]]
    general_researcher_information: list[tuple[str, str]]
    # Defaulted so a frontend built against this schema still works when it
    # talks to a backend that has not been redeployed yet.
    relevant_documents: list[RelevantDocument] = []


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)


@app.post("/")
async def get_llm_response(
    body: ChatRequest, x_api_key: str | None = Header(default=None)
) -> LLMResponse:
    require_api_key(x_api_key)

    # Honour only the most recent turns. The client is expected to send a
    # trimmed transcript, but it is untrusted input, so cap it here too.
    max_messages = settings.max_history_turns * 2
    recent = body.messages[-max_messages:]

    formatted_messages = [
        ("user" if msg.role == "user" else "ai", msg.content) for msg in recent
    ]

    state = memory_graph.memory_invoke_graph(MemoryState(query=formatted_messages))

    # SearchAndEvaluateNode already slices to context_documents, but the
    # researcher-lookup path returns every document by the named researchers,
    # so cap here too rather than shipping a hundred rows to the browser.
    documents = (state.get("documents") or [])[: settings.context_documents]

    return LLMResponse(
        text_answer=state.get("text_answer") or "",
        most_relevant_researchers=state.get("most_relevant_researchers") or [],
        general_researcher_information=state.get("general_researcher_information") or [],
        relevant_documents=[
            RelevantDocument(
                doc_id=doc.doc_id,
                title=doc.title,
                name=doc.name,
                score=doc.score,
                similarity=doc.similarity,
            )
            for doc in documents
        ],
    )
