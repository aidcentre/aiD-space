"""
Load the pickled corpus into Cosmos DB and Blob Storage. Run once:

    python scripts/ingest.py

Idempotent: everything is upserted under a deterministic id, so re-running
after a corpus change is safe.

What goes where
---------------
  Blob   documents/<doc_id>.txt   full document text (up to 1 MB each)
  Cosmos documents               one item per document: metadata + 2000-char preview
  Cosmos knowledgebase           one item per chunk: text + 768-dim vector
  Cosmos researchers             the AID roster with scholar/orcid links
"""

import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd
from azure.cosmos import exceptions

sys.path.insert(0, "src")
from aid_expertise_search import azure_store  # noqa: E402
from aid_expertise_search.config import settings  # noqa: E402
from aid_expertise_search.functions import load_dataframe  # noqa: E402

PREVIEW_CHARS = 2000
# Chunk text is capped because a handful of "chunks" are whole 65 KB pages, and
# oversized items inflate both RU cost and full-text index size for no gain.
MAX_CHUNK_CHARS = 8000
UPLOAD_WORKERS = 16


def upload_full_text(doc_id: str, full_text: str) -> str:
    blob_path = f"documents/{doc_id}.txt"
    azure_store.blob_container_client().upload_blob(
        name=blob_path, data=full_text.encode("utf-8"), overwrite=True
    )
    return blob_path


def ingest_documents(df: pd.DataFrame) -> None:
    container = azure_store.documents_container()
    print(f"documents         {len(df)} records")

    def one(row) -> None:
        doc_id = str(row["index"])
        blob_path = upload_full_text(doc_id, row["full_text"])
        container.upsert_item(
            {
                "id": f"doc-{doc_id}",
                "doc_id": doc_id,
                "name": row["name"],
                "title": row["title"],
                "type": row["type"],
                "preview": row["full_text"][:PREVIEW_CHARS],
                "blob_path": blob_path,
                "n_chunks": len(row["chunks"]),
            }
        )

    _run(one, [row for _, row in df.iterrows()], "documents")


def ingest_chunks(df: pd.DataFrame) -> None:
    container = azure_store.chunks_container()
    items = []
    for _, row in df.iterrows():
        doc_id = str(row["index"])
        embeddings = row["chunk_embeddings"]
        for i, (text, vector) in enumerate(zip(row["chunks"], embeddings)):
            items.append(
                {
                    "id": f"{doc_id}-{i}",
                    "doc_id": doc_id,
                    "name": row["name"],
                    "title": row["title"],
                    "chunk_index": i,
                    "text": text[:MAX_CHUNK_CHARS],
                    "vector": [float(x) for x in vector],
                }
            )

    print(f"chunks            {len(items)} records")
    _run(container.upsert_item, items, "chunks")


def ingest_researchers(df: pd.DataFrame) -> None:
    container = azure_store.researchers_container()
    print(f"researchers       {len(df)} records")
    items = [
        {
            "id": row["name"],
            "name": row["name"],
            "google_scholar": row.get("google_scholar", ""),
            "web_page": row.get("web_page", ""),
            "orcid_id": row.get("orcid_id", ""),
        }
        for _, row in df.iterrows()
    ]
    _run(container.upsert_item, items, "researchers")


def _run(fn, items, label: str) -> None:
    """Upsert in parallel; serverless Cosmos throttles, so retry on 429."""
    done = 0
    failures = 0
    with ThreadPoolExecutor(max_workers=UPLOAD_WORKERS) as pool:
        futures = {pool.submit(_with_retry, fn, item): item for item in items}
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as exc:  # noqa: BLE001 - report and keep going
                failures += 1
                print(f"  failed: {exc}")
            done += 1
            if done % 250 == 0:
                print(f"  {label}: {done}/{len(items)}")
    print(f"  {label}: {done - failures}/{len(items)} written"
          + (f", {failures} FAILED" if failures else ""))


def _with_retry(fn, item, attempts: int = 5):
    import time

    for attempt in range(attempts):
        try:
            return fn(item)
        except exceptions.CosmosHttpResponseError as exc:
            if exc.status_code == 429 and attempt < attempts - 1:
                time.sleep(0.5 * (2**attempt))
                continue
            raise


def main() -> None:
    if not settings.cosmos_endpoint:
        sys.exit("COSMOS_ENDPOINT is not set. Copy .env.example to .env and fill it in.")

    documents = load_dataframe("documents.pkl")
    researchers = load_dataframe("researcher_information.pkl")

    ingest_researchers(researchers)
    ingest_documents(documents)
    ingest_chunks(documents)
    print("\ndone.")


if __name__ == "__main__":
    main()
