from sentence_transformers import SentenceTransformer
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from aid_expertise_search.config import settings

api_key = SecretStr(settings.openai_api_key) if settings.openai_api_key else None

# One model for every call. The strong/medium/weak names are kept so existing
# imports keep working, but they are aliases now, not a tiered set — change
# OPENAI_MODEL to move all of them at once.
strong_client = ChatOpenAI(model=settings.openai_model, temperature=0.0, api_key=api_key)
medium_client = ChatOpenAI(model=settings.openai_model, temperature=0.0, api_key=api_key)
weak_client = ChatOpenAI(model=settings.openai_model, temperature=0.0, api_key=api_key)
answer_client = ChatOpenAI(
    model=settings.openai_model,
    temperature=0.0,
    api_key=api_key,
    tags=["answer"],
)

embedding_model: SentenceTransformer | None = None


def load_models() -> None:
    """
    Load the embedding model into the module global.

    Called once from the FastAPI lifespan hook. The weights are baked into the
    Docker image, so this is a local disk read rather than a network download.
    """
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer(settings.embedding_model)


def encode(text: str) -> list[float]:
    """Embed `text` as a plain list, ready to hand to Cosmos as a query parameter."""
    if embedding_model is None:
        raise RuntimeError("load_models() has not run")
    return embedding_model.encode(text).tolist()
