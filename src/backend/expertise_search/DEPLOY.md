# Deploying the AID expertise-search backend to Azure

Architecture:

```
  Browser
     |  POST /chat
  SvelteKit (Netlify)  --- adds X-API-Key, trims history to 3 turns
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

## Current deployment

| | |
| --- | --- |
| Subscription | pay-as-you-go |
| Resource group | `stf-asc-export` |
| Container App | `aid-api-rag` (West Europe) |
| Container Apps environment | `aid-rag-env` (West Europe) |
| Registry | `aidrag.azurecr.io`, image `aid-backend:v1` |
| Cosmos DB NoSQL | `aid-rag-search-cosmosdb`, database `RagDB` |
| Storage account | `aidknowledgebase`, blob container `documents` |

Cosmos and the Container App do not have to share a region, and here they do
not. The previous deployment also ran split — app in Norway East, Cosmos in
Germany West Central — because vector search was not available in every region.

This replaced an earlier stack on an Azure for Students subscription
(resource group `aiD-rag-demo`, app `api-rag-demo`, registry `acrragdemo`,
Cosmos `cosmosnosqlaidragdemo`, storage `aiddemoknowledgebase`). Nothing was
copied across accounts: the entire corpus rebuilds from the pickled datasets in
`src/aid_expertise_search/datasets/`, so migrating is provision + ingest.

---

## The short version

```bash
az login
```

```bash
powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1 -CapabilitiesOnly
```

```bash
python scripts/provision.py && python scripts/ingest.py
```

```bash
powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1
```

`azure_deploy.ps1` is idempotent — it checks for each resource before creating
it, so a failed run can be re-run without cleaning up. It reads every secret
from `.env` and stores none itself.

The rest of this document explains what those steps do and what breaks.

---

## 0. Prerequisites

The Azure CLI. You do **not** need Docker — on a pay-as-you-go subscription
`az acr build` builds the image server-side.

```bash
winget install --exact --id Microsoft.AzureCLI
```

Then open a new terminal, sign in, and pin the subscription if you have more
than one:

```bash
az login
```

```bash
az account set --subscription "<subscription name or id>"
```

`azure_deploy.ps1` prints the subscription and signed-in user before it changes
anything. Read that line — deploying into the wrong account is the easiest
mistake to make here, especially with an old subscription still active.

---

## 1. Fill in `.env`

Start from `.env.example`.

| Value | Where in the Azure portal |
| --- | --- |
| `COSMOS_ENDPOINT` | Cosmos account → **Settings → Keys** → *URI* |
| `COSMOS_KEY` | Same page → *PRIMARY KEY* (click the eye icon) |
| `COSMOS_DATABASE` | Cosmos account → **Data Explorer**. `RagDB` here |
| `AZURE_STORAGE_ACCOUNT` | Storage account → **Overview** → the resource name |
| `AZURE_STORAGE_KEY` | Storage account → **Security + networking → Access keys** → *key1 → Key* |

Generate the shared secret yourself:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Put it in `BACKEND_API_KEY` here **and** in the frontend. Generate a fresh one
per deployment — a key that was valid for a retired backend should not come
along to the new one.

---

## 2. Enable the Cosmos capabilities — do this first

**This is the step that stops a new account cold.** Hybrid search needs a
vector policy *and* a full-text policy on the chunk container, and each is
gated behind an account-level capability that is off by default:

- `EnableNoSQLVectorSearch`
- `EnableNoSQLFullTextSearchPreviewFeatures`

Without them `scripts/provision.py` fails with:

```
(BadRequest) A Container Vector Policy has been provided, but the capability
has not been enabled on your account.
```

A Cosmos key cannot turn these on — it is a control-plane change, so it needs
`az login`, not `COSMOS_KEY`:

```bash
powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1 -CapabilitiesOnly
```

Or in the portal: Cosmos account → **Settings → Features** → enable *Vector
Search for NoSQL API* and *Full-Text & Hybrid Search for NoSQL API*.

Two things to know if you do it by hand with the CLI:

- `az cosmosdb update --capabilities` **replaces** the list rather than
  appending to it. Read the current capabilities and pass them all. Dropping
  `EnableServerless` this way is not recoverable — it cannot be re-added after
  account creation.
- Enabling takes a minute or two to propagate. If `provision.py` still fails
  immediately afterwards, wait and retry before assuming something is wrong.

---

## 3. Create the containers, then load the data

```bash
pip install -e ".[ingest]"
```

```bash
python scripts/provision.py
```

That creates:

- `KnowledgeBase` — partition key `/doc_id`, vector index on `/vector`
  (`quantizedFlat`, cosine, 768), full-text index on `/text`
- `documents` — partition key `/doc_id`, document metadata + 2000-char preview
- `researchers` — partition key `/name`, the 32-person roster
- Blob container `documents`

Pass `--recreate` **only** to drop and rebuild the chunk container. The vector
and full-text policies are fixed at creation, so a container made before those
policies existed cannot be fixed in place. On an empty account there is nothing
to recreate.

Then load the corpus (281 documents, ~5,370 chunks — expect a few minutes):

```bash
python scripts/ingest.py
```

It upserts under deterministic ids, so it is safe to re-run. Verify in **Data
Explorer → KnowledgeBase → Items** that items have both a `text` and a
`vector` field.

---

## 4. Run it locally against Azure

```bash
uvicorn main:app --reload
```

```bash
python scripts/smoke_test.py
```

Get a real answer here before deploying. Debugging a container build is far
slower than debugging a local process, and at this point the whole data layer
is already live in Azure — the only untested part is packaging.

---

## 5. Build and deploy

```bash
powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1
```

That builds the image with `az acr build`, creates the Container Apps
environment if absent, and creates or updates the app. First build takes
~15 minutes; only the build context is uploaded, not the image.

Three settings matter and each one fails quietly:

- **`--target-port 8000`.** The ACA default is 80; uvicorn listens on 8000.
  Traffic is silently dropped otherwise.
- **`--min-replicas 1`.** Scale-to-zero means every idle period ends in a cold
  start that loads a 420 MB model — tens of seconds of user-visible delay.
- **`--memory 4Gi`.** torch plus the model will not fit in less.

Secrets go in as Container App secrets and are referenced as
`secretref:openai-key` and friends, so they do not show up as plain env vars in
`az containerapp show`.

If `az acr build` fails with `TasksOperationsNotAllowed`, ACR Tasks is not
permitted on the subscription — that was the case on Azure for Students. Build
locally instead, then redeploy without rebuilding:

```bash
powershell -ExecutionPolicy Bypass -File scripts\build_and_push.ps1
```

```bash
powershell -ExecutionPolicy Bypass -File scripts\azure_deploy.ps1 -SkipBuild
```

The script prints the assigned FQDN. Smoke test it:

```bash
python scripts/smoke_test.py --url https://<fqdn>
```

---

## 6. Point the frontend at it

The frontend lives in the `aiD-space` repo and proxies through
`src/routes/chat/+server.ts`. That route currently has the backend URL and key
**hardcoded** rather than read from the environment; there is a comment there
explaining why and what to restore. Update both constants to the new FQDN and
the new `BACKEND_API_KEY`, and redeploy.

The config-driven version reads `PRIVATE_BACKEND_URL` and `BACKEND_API_KEY`
from `$env/dynamic/private`. Both are server-side only — do not prefix them
with `PUBLIC_`, or they get bundled into client JavaScript.

---

## 7. Rotate the keys

Any key that has been pasted into a chat, a commit, or a `.env` shared between
machines should be rotated once the deployment is verified:

- Cosmos: **Settings → Keys → Regenerate Primary Key**
- Storage: **Security + networking → Access keys → Rotate key1**
- OpenAI: revoke and reissue in the OpenAI dashboard
- `BACKEND_API_KEY`: generate a new one, set it on the Container App and in the
  frontend together — they must match or every search returns 401

After rotating, update `.env`, re-run `azure_deploy.ps1 -SkipBuild` to push the
new secrets to the Container App, and redeploy the frontend.

---

## Updating the corpus later

```bash
python scripts/ingest.py          # upserts; safe to re-run
```

Only re-run `provision.py --recreate` if the embedding model or its dimension
count changes, since the vector policy is immutable.

## Optional hardening: managed identity instead of keys

`azure_deploy.ps1` uses ACR admin credentials because assigning `AcrPull` to a
system-assigned identity requires role-assignment rights on the subscription,
which plain Contributor does not have.

The application code already falls back to `DefaultAzureCredential` whenever
the matching key env var is absent. To switch:

```bash
az containerapp identity assign --name aid-api-rag --resource-group stf-asc-export --system-assigned
```

Grant that identity the **Cosmos DB Built-in Data Contributor** role and the
**Storage Blob Data Reader** role, then remove `COSMOS_KEY` and
`AZURE_STORAGE_KEY` from the Container App. Role assignments take a few minutes
to propagate, so check `/health` before assuming it is broken.
