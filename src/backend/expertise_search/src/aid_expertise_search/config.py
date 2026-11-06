"""
Central configuration, read from environment variables.

Locally these come from .env (see .env.example). In Azure Container Apps they
come from the container's environment variables and secrets.
"""

from dataclasses import dataclass
from os import getenv
from dotenv import load_dotenv

load_dotenv()


def _int(name: str, default: int) -> int:
    raw = getenv(name)
    return int(raw) if raw else default


def _float(name: str, default: float) -> float:
    raw = getenv(name)
    return float(raw) if raw else default


@dataclass(frozen=True)
class Settings:
    # --- OpenAI ---
    openai_api_key: str | None = getenv("OPENAI_API_KEY")
    openai_model: str = getenv("OPENAI_MODEL") or "gpt-5.4-nano"

    # --- Auth between the SvelteKit proxy and this backend ---
    # If unset, auth is disabled (local development only).
    backend_api_key: str | None = getenv("BACKEND_API_KEY")

    # --- Cosmos DB ---
    cosmos_endpoint: str | None = getenv("COSMOS_ENDPOINT")
    # If cosmos_key is unset we fall back to DefaultAzureCredential (managed identity).
    cosmos_key: str | None = getenv("COSMOS_KEY")
    cosmos_database: str = getenv("COSMOS_DATABASE") or "ragdb"
    cosmos_chunks_container: str = getenv("COSMOS_CHUNKS_CONTAINER") or "knowledgebase"
    cosmos_documents_container: str = getenv("COSMOS_DOCUMENTS_CONTAINER") or "documents"
    cosmos_researchers_container: str = (
        getenv("COSMOS_RESEARCHERS_CONTAINER") or "researchers"
    )

    # --- Blob storage (full document text; Cosmos items cap at 2 MB) ---
    storage_account: str | None = getenv("AZURE_STORAGE_ACCOUNT")
    storage_key: str | None = getenv("AZURE_STORAGE_KEY")
    blob_container: str = getenv("AZURE_BLOB_CONTAINER") or "documents"

    # --- Embedding model ---
    # Baked into the Docker image at build time; see Dockerfile.
    embedding_model: str = (
        getenv("EMBEDDING_MODEL") or "sentence-transformers/all-mpnet-base-v2"
    )
    embedding_dimensions: int = _int("EMBEDDING_DIMENSIONS", 768)

    # --- Retrieval tuning ---
    # Number of chunks pulled back from each Cosmos query.
    retrieval_top_k: int = _int("RETRIEVAL_TOP_K", 60)
    # Number of documents handed to the answering LLM as context.
    context_documents: int = _int("CONTEXT_DOCUMENTS", 5)
    # Cosine similarity below which we treat the corpus as having no answer.
    # Calibrated against this corpus: on-topic queries score 0.55-0.75, clearly
    # off-topic ones 0.17-0.25. The original 0.2 floor let nonsense through.
    min_similarity: float = _float("MIN_SIMILARITY", 0.4)
    # RRF weights: [vector, full-text]. Vector is weighted higher because the
    # corpus is academic prose where keyword overlap is noisy.
    rrf_vector_weight: float = _float("RRF_VECTOR_WEIGHT", 2.0)
    rrf_text_weight: float = _float("RRF_TEXT_WEIGHT", 1.0)
    # Standard RRF smoothing constant.
    rrf_k: int = _int("RRF_K", 60)
    # Conversation turns of client-supplied history to honour.
    max_history_turns: int = _int("MAX_HISTORY_TURNS", 3)


settings = Settings()
