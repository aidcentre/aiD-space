"""
Create the Cosmos containers and the Blob container this backend expects.

Run once, before scripts/ingest.py:

    python scripts/provision.py

Why the container you created in the portal has to be replaced
-------------------------------------------------------------
Hybrid search needs *three* things on the container, and a vector policy alone
is not enough:

  1. a vector embedding policy on /vector      <- you have this
  2. a full text policy on /text               <- missing
  3. a full text index on /text                <- missing

Vector and full text policies are fixed at container creation. Since the
container is still empty, the cheapest fix is to drop and recreate it, which is
what this script does when you pass --recreate.
"""

import argparse
import sys

from azure.cosmos import CosmosClient, PartitionKey, exceptions
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

sys.path.insert(0, "src")
from aid_expertise_search.config import settings  # noqa: E402


def cosmos_client() -> CosmosClient:
    if not settings.cosmos_endpoint:
        sys.exit("COSMOS_ENDPOINT is not set. Copy .env.example to .env and fill it in.")
    credential = settings.cosmos_key or DefaultAzureCredential()
    return CosmosClient(settings.cosmos_endpoint, credential=credential)


def chunk_container_spec() -> dict:
    """Vector policy, full text policy and indexing policy for the chunk container."""
    vector_embedding_policy = {
        "vectorEmbeddings": [
            {
                "path": "/vector",
                "dataType": "float32",
                "distanceFunction": "cosine",
                "dimensions": settings.embedding_dimensions,
            }
        ]
    }

    full_text_policy = {
        "defaultLanguage": "en-US",
        "fullTextPaths": [{"path": "/text", "language": "en-US"}],
    }

    indexing_policy = {
        "indexingMode": "consistent",
        "automatic": True,
        "includedPaths": [{"path": "/*"}],
        "excludedPaths": [
            {"path": '/"_etag"/?'},
            # The raw vector must be excluded from the normal index or every
            # write pays to index 768 floats twice.
            {"path": "/vector/*"},
        ],
        "fullTextIndexes": [{"path": "/text"}],
        "vectorIndexes": [{"path": "/vector", "type": "quantizedFlat"}],
    }

    return {
        "vector_embedding_policy": vector_embedding_policy,
        "full_text_policy": full_text_policy,
        "indexing_policy": indexing_policy,
    }


def provision_cosmos(recreate: bool) -> None:
    client = cosmos_client()
    database = client.create_database_if_not_exists(settings.cosmos_database)
    print(f"database          {settings.cosmos_database}")

    name = settings.cosmos_chunks_container
    if recreate:
        try:
            database.delete_container(name)
            print(f"deleted           {name}")
        except exceptions.CosmosResourceNotFoundError:
            pass

    try:
        database.create_container(
            id=name,
            partition_key=PartitionKey(path="/doc_id"),
            **chunk_container_spec(),
        )
        print(f"created           {name}  (vector + full text)")
    except exceptions.CosmosResourceExistsError:
        print(
            f"exists            {name}  — if it predates this script it is missing the\n"
            f"                  full text policy. Re-run with --recreate."
        )

    for container_name, pk in (
        (settings.cosmos_documents_container, "/doc_id"),
        (settings.cosmos_researchers_container, "/name"),
    ):
        database.create_container_if_not_exists(
            id=container_name, partition_key=PartitionKey(path=pk)
        )
        print(f"ready             {container_name}")


def provision_blob() -> None:
    if not settings.storage_account:
        print("skipped blob      AZURE_STORAGE_ACCOUNT is not set")
        return
    account_url = f"https://{settings.storage_account}.blob.core.windows.net"
    credential = settings.storage_key or DefaultAzureCredential()
    service = BlobServiceClient(account_url, credential=credential)
    container = service.get_container_client(settings.blob_container)
    if not container.exists():
        container.create_container()
        print(f"created           blob container {settings.blob_container}")
    else:
        print(f"ready             blob container {settings.blob_container}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--recreate",
        action="store_true",
        help="drop and recreate the chunk container (destroys its data)",
    )
    args = parser.parse_args()

    provision_cosmos(args.recreate)
    provision_blob()
    print("\ndone. next: python scripts/ingest.py")


if __name__ == "__main__":
    main()
