# Deploying the AID expertise-search backend to Azure

Architecture:

```
  Browser
     |  POST /chat
  SvelteKit (Vercel)  --- adds X-API-Key, trims history to 3 turns
     |  POST /
  Azure Container App  --- FastAPI + LangGraph + all-mpnet-base-v2 (baked in)
     |                     |
     |  hybrid search      |  full document text
  Cosmos DB NoSQL        Blob Storage
  (vector + full text)
```

The backend holds no state between requests. Conversation memory is client-side
and arrives in the request body.

---

## 0. Prerequisites

You need the Azure CLI. You do **not** need Docker — `az acr build` builds the
image in Azure.

```bash
winget install --exact --id Microsoft.AzureCLI
```

Then open a new terminal and sign in:

```bash
az login
```

If you have more than one subscription, pin the right one:

```bash
az account set --subscription "<subscription name or id>"
```

---

## 1. Collect these values from the portal

Fill them into `.env` (start from `.env.example`).

| Value | Where in the Azure portal |
| --- | --- |
| `COSMOS_ENDPOINT` | Cosmos account → **Settings → Keys** → *URI* |
| `COSMOS_KEY` | Same page → *PRIMARY KEY* (click the eye icon) |
| `COSMOS_DATABASE` | Cosmos account → **Data Explorer** → the database name above `knowledgebase`. Defaults to `ragdb` |
| `AZURE_STORAGE_ACCOUNT` | Storage account → **Overview** → the resource name itself |
| `AZURE_STORAGE_KEY` | Storage account → **Security + networking → Access keys** → *key1 → Key* |
| ACR login server | Container Registry → **Overview** → *Login server* (`<name>.azurecr.io`) |
| Resource group name | Any of the above → **Overview** → *Resource group* |
| Region | Any of the above → **Overview** → *Location* |

Generate the shared secret yourself:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Put it in `BACKEND_API_KEY` in the backend `.env` **and** in the frontend `.env`.

---

## 2. Recreate the Cosmos container, then load the data

Your `knowledgebase` container has the vector policy but **not** the full-text
policy or full-text index, and both are fixed at container creation. Hybrid
search will fail without them. The container is empty, so recreating it costs
nothing.

```bash
pip install -e ".[ingest]"
```

```bash
python scripts/provision.py --recreate
```

That creates:

- `knowledgebase` — partition key `/doc_id`, vector index on `/vector`
  (`quantizedFlat`, cosine, 768), full-text index on `/text`
- `documents` — partition key `/doc_id`, document metadata + 2000-char preview
- `researchers` — partition key `/name`, the 32-person roster
- Blob container `documents`

Then load the corpus (281 documents, 5,370 chunks — expect a few minutes):

```bash
python scripts/ingest.py
```

Verify in **Data Explorer → knowledgebase → Items** that items have both a
`text` and a `vector` field.

---

## 3. Run it locally against Azure

```bash
uvicorn main:app --reload
```

```bash
curl -s -X POST http://127.0.0.1:8000/ -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"content\":\"who works on battery degradation modelling\"}]}"
```

Get a real answer here before deploying — it is far faster to debug locally.

---

## 4. Build the image and push it

`az acr build` does **not** work on this subscription — ACR Tasks is blocked on
Azure for Students and fails with `TasksOperationsNotAllowed`. The image has to
be built locally with Docker Desktop and pushed.

```bash
powershell -ExecutionPolicy Bypass -File scripts\build_and_push.ps1
```

That runs `az acr login`, `docker build --platform linux/amd64` and
`docker push`. No registry secrets are needed — `az acr login` reuses your
Azure CLI session.

First run takes ~15 minutes to build and moves 2–3 GB on the push. Later pushes
are much smaller: torch and the model live in early, stable layers, so editing
application code only reships the last layer.

Allow the Container App to pull from the registry:

```bash
az acr update --name <acr-name> --admin-enabled true
```

---

## 5. Deploy to the Container App

This project's resources:

| | |
| --- | --- |
| Resource group | `aiD-rag-demo` |
| Container App | `api-rag-demo` |
| Registry | `acrragdemo.azurecr.io` |
| Region | `norwayeast` |

The app is still on the `k8se/quickstart` sample image with settings that will
**not** run this backend — port 80, 0.25 CPU, 0.5 GiB, scale-to-zero. All four
have to change.

Store the secrets first, so they never appear as plain env vars:

```bash
az containerapp secret set --name api-rag-demo --resource-group aiD-rag-demo --secrets openai-key="<OPENAI_API_KEY>" cosmos-key="<COSMOS_KEY>" storage-key="<AZURE_STORAGE_KEY>" backend-api-key="<BACKEND_API_KEY>"
```

Then point it at the image and give it room to run:

```bash
az containerapp update --name api-rag-demo --resource-group aiD-rag-demo --image acrragdemo.azurecr.io/aid-backend:v1 --cpu 2 --memory 4Gi --min-replicas 1 --max-replicas 3 --set-env-vars OPENAI_API_KEY=secretref:openai-key COSMOS_KEY=secretref:cosmos-key AZURE_STORAGE_KEY=secretref:storage-key BACKEND_API_KEY=secretref:backend-api-key COSMOS_ENDPOINT="<COSMOS_ENDPOINT>" COSMOS_DATABASE=RagDB COSMOS_CHUNKS_CONTAINER=KnowledgeBase AZURE_STORAGE_ACCOUNT="<storage account name>"
```

Move ingress from port 80 to 8000:

```bash
az containerapp ingress enable --name api-rag-demo --resource-group aiD-rag-demo --type external --target-port 8000 --transport auto
```

Give the app permission to pull from the registry:

```bash
az containerapp registry set --name api-rag-demo --resource-group aiD-rag-demo --server acrragdemo.azurecr.io --identity system
```

Three settings matter and are easy to get wrong:

- **`--target-port 8000`.** The app currently routes to port 80; uvicorn listens
  on 8000. Traffic silently fails otherwise.
- **`--min-replicas 1`.** Scale-to-zero means every idle period is followed by a
  cold start that loads a 420 MB model — tens of seconds of user-visible delay.
- **`--memory 4Gi`.** The model plus torch will not fit in the current 0.5 GiB.

The public URL is already assigned and does not change:

```
https://api-rag-demo.happybay-96c5cfb7.norwayeast.azurecontainerapps.io
```

Check it, then run the full smoke test against it:

```bash
python scripts/smoke_test.py --url https://api-rag-demo.happybay-96c5cfb7.norwayeast.azurecontainerapps.io
```

---

## 6. Point the frontend at it

In the Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `PRIVATE_BACKEND_URL` | `https://<fqdn>` (no trailing slash) |
| `BACKEND_API_KEY` | the same secret from step 1 |

Redeploy the frontend. Both are server-side only — do not prefix them with
`PUBLIC_`, or they will be bundled into client JavaScript.

---

## 7. Rotate the keys that have been sitting in git-ignored files

`aidspace_backend/.env` and `aidspace_frontend/.env` contain a live OpenAI key
and a live Sanity token in plaintext. They are now also in Azure config. Rotate
both and update the values in Azure and Vercel.

---

## Updating the corpus later

```bash
python scripts/ingest.py          # upserts; safe to re-run
```

Only re-run `provision.py --recreate` if the embedding model or its dimension
count changes, since the vector policy is immutable.

## Optional hardening: managed identity instead of keys

The code already falls back to `DefaultAzureCredential` whenever the matching
key env var is absent. To switch:

```bash
az containerapp identity assign --name <app-name> --resource-group <rg> --system-assigned
```

Grant that identity the **Cosmos DB Built-in Data Contributor** role and the
**Storage Blob Data Reader** role, then remove `COSMOS_KEY` and
`AZURE_STORAGE_KEY` from the Container App. Role assignments can take a few
minutes to propagate, so verify with `/health` before assuming it is broken.
