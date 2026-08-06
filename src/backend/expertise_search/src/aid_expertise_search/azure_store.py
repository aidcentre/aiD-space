"""
Azure data plane: Cosmos DB (vectors + full-text) and Blob Storage (full text).

Data model
----------
Two containers in the `ragdb` database:

  knowledgebase   one item per *chunk*  (partition key /doc_id)
      { id, doc_id, name, title, chunk_index, text, vector[768] }
      `/vector` is the vector index, `/text` is the full-text index.

  documents       one item per *document* (partition key /doc_id)
      { id, doc_id, name, title, preview, blob_path, n_chunks }
      `preview` is the first 2000 characters, which is all the answering
      prompt has ever used. Full text lives in Blob because a single
      document reaches 1 MB and Cosmos items cap at 2 MB.

Auth falls back to DefaultAzureCredential (managed identity) whenever an
account key is absent, so the same code runs locally with keys and in ACA
with a managed identity.
"""

from functools import lru_cache
from typing import Any, Iterable
import re

from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

from aid_expertise_search.config import settings

# Tokens too generic to be worth a full-text clause. Kept deliberately small:
# over-filtering here silently degrades the BM25 half of the hybrid query.
_FTS_STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "does",
    "for", "from", "has", "have", "how", "i", "in", "is", "it", "its", "me",
    "of", "on", "or", "that", "the", "their", "them", "there", "they", "this",
    "to", "was", "what", "when", "where", "which", "who", "why", "will", "with",
    "you", "your", "about", "any", "some", "we", "us", "our",
}

# Cosmos rejects very long FullTextScore term lists; academic queries rarely
# benefit past this many terms anyway.
_MAX_FTS_TERMS = 12


@lru_cache(maxsize=1)
def _credential() -> DefaultAzureCredential:
    return DefaultAzureCredential()


@lru_cache(maxsize=1)
def cosmos_client() -> CosmosClient:
    if not settings.cosmos_endpoint:
        raise RuntimeError("COSMOS_ENDPOINT is not set")
    if settings.cosmos_key:
        return CosmosClient(settings.cosmos_endpoint, credential=settings.cosmos_key)
    return CosmosClient(settings.cosmos_endpoint, credential=_credential())


@lru_cache(maxsize=1)
def chunks_container():
    return cosmos_client().get_database_client(
        settings.cosmos_database
    ).get_container_client(settings.cosmos_chunks_container)


@lru_cache(maxsize=1)
def documents_container():
    return cosmos_client().get_database_client(
        settings.cosmos_database
    ).get_container_client(settings.cosmos_documents_container)


@lru_cache(maxsize=1)
def researchers_container():
    return cosmos_client().get_database_client(
        settings.cosmos_database
    ).get_container_client(settings.cosmos_researchers_container)


@lru_cache(maxsize=1)
def blob_container_client():
    if not settings.storage_account:
        raise RuntimeError("AZURE_STORAGE_ACCOUNT is not set")
    account_url = f"https://{settings.storage_account}.blob.core.windows.net"
    if settings.storage_key:
        service = BlobServiceClient(account_url, credential=settings.storage_key)
    else:
        service = BlobServiceClient(account_url, credential=_credential())
    return service.get_container_client(settings.blob_container)


def extract_keywords(query: str) -> list[str]:
    """
    Reduce a natural-language query to the terms handed to FullTextScore.

    Returns [] when nothing survives, which callers must treat as "skip the
    full-text half" — FullTextScore with zero terms is a syntax error.
    """
    words = re.findall(r"[A-Za-zÆØÅæøå0-9]+", query.lower())
    seen: list[str] = []
    for w in words:
        if len(w) > 2 and w not in _FTS_STOPWORDS and w not in seen:
            seen.append(w)
    return seen[:_MAX_FTS_TERMS]


def hybrid_search(vector: list[float], query: str, top_k: int) -> list[dict[str, Any]]:
    """
    Rank chunks by Reciprocal Rank Fusion of vector similarity and BM25.

    Cosmos will not let RRF appear in a projection, so no fused score comes
    back — only the ordering. We convert position to a score with the standard
    1/(k + rank) form, which is what RRF computes internally anyway.
    """
    terms = extract_keywords(query)
    parameters: list[dict[str, Any]] = [
        {"name": "@qv", "value": vector},
        {"name": "@k", "value": top_k},
    ]

    projection = "SELECT TOP @k c.id, c.doc_id, c.name, c.title, c.chunk_index, c.text"

    if terms:
        term_params = []
        for i, term in enumerate(terms):
            parameters.append({"name": f"@t{i}", "value": term})
            term_params.append(f"@t{i}")
        # Weights are inlined rather than parameterized: every documented
        # example uses a literal array, and they are floats straight from
        # config, so there is nothing to inject.
        weights = f"[{float(settings.rrf_vector_weight)}, {float(settings.rrf_text_weight)}]"
        query_text = (
            f"{projection} FROM c "
            f"ORDER BY RANK RRF("
            f"VectorDistance(c.vector, @qv), "
            f"FullTextScore(c.text, {', '.join(term_params)}), "
            f"{weights})"
        )
    else:
        # No usable keywords: degrade to pure vector search rather than
        # emitting an invalid zero-term FullTextScore.
        query_text = f"{projection} FROM c ORDER BY VectorDistance(c.vector, @qv)"

    items = list(
        chunks_container().query_items(
            query=query_text, parameters=parameters, enable_cross_partition_query=True
        )
    )

    for rank, item in enumerate(items, start=1):
        item["rrf_score"] = 1.0 / (settings.rrf_k + rank)
        item["rank"] = rank
    return items


def vector_search(vector: list[float], top_k: int) -> list[dict[str, Any]]:
    """
    Pure vector search that *does* project the similarity score.

    RRF gives ordering but no magnitude, so it cannot tell "best of a bad lot"
    from "genuinely relevant". This second query supplies the absolute cosine
    similarity used to gate low-confidence answers.
    """
    query_text = (
        "SELECT TOP @k c.id, c.doc_id, c.name, c.title, "
        "VectorDistance(c.vector, @qv) AS similarity "
        "FROM c ORDER BY VectorDistance(c.vector, @qv)"
    )
    parameters = [{"name": "@qv", "value": vector}, {"name": "@k", "value": top_k}]
    # Chunks are partitioned by /doc_id, so every search spans partitions. The
    # SDK still requires this to be opted into explicitly.
    return list(
        chunks_container().query_items(
            query=query_text, parameters=parameters, enable_cross_partition_query=True
        )
    )


def get_documents(doc_ids: Iterable[str]) -> dict[str, dict[str, Any]]:
    """Fetch document records by id, keyed by doc_id."""
    ids = list(dict.fromkeys(doc_ids))
    if not ids:
        return {}
    parameters = [{"name": "@ids", "value": ids}]
    items = documents_container().query_items(
        query="SELECT * FROM c WHERE ARRAY_CONTAINS(@ids, c.doc_id)",
        parameters=parameters,
        enable_cross_partition_query=True,
    )
    return {item["doc_id"]: item for item in items}


def documents_by_researchers(names: list[str]) -> list[dict[str, Any]]:
    """All documents authored by any of `names`."""
    if not names:
        return []
    parameters = [{"name": "@names", "value": names}]
    return list(
        documents_container().query_items(
            query="SELECT * FROM c WHERE ARRAY_CONTAINS(@names, c.name)",
            parameters=parameters,
            enable_cross_partition_query=True,
        )
    )


def list_researchers() -> list[str]:
    """
    Every AID researcher, including the few who have no documents indexed.

    Name matching in `filter_AID_authors` has to cover the whole roster, not
    just authors present in the corpus, or asking about a researcher with no
    indexed papers silently falls through to a generic semantic search.
    """
    rows = researchers_container().query_items(
        query="SELECT DISTINCT VALUE c.name FROM c",
        enable_cross_partition_query=True,
    )
    return sorted(rows)


def read_full_text(blob_path: str) -> str:
    """Fetch a document's full text from Blob Storage."""
    return blob_container_client().get_blob_client(blob_path).download_blob().readall().decode("utf-8")
