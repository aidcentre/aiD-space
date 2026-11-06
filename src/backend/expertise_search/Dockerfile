# syntax=docker/dockerfile:1

FROM python:3.13-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    # Keep the model cache on a predictable path so the runtime stage can copy it.
    HF_HOME=/opt/hf \
    # The weights are baked in; never reach out to HuggingFace at runtime.
    HF_HUB_OFFLINE=1 \
    TRANSFORMERS_OFFLINE=1

WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------
# CPU-only torch. The default wheel pulls ~2.5 GB of CUDA libraries that an
# ACA container can never use. Version matches what is verified working on
# Python 3.13 locally — earlier 2.x releases have no cp313 wheels.
RUN pip install --no-cache-dir \
    --index-url https://download.pytorch.org/whl/cpu \
    torch==2.12.1

COPY pyproject.toml README.md ./
COPY src/aid_expertise_search/__init__.py src/aid_expertise_search/__init__.py
RUN pip install --no-cache-dir .

# ---------------------------------------------------------------------------
# Bake the embedding model into the image
# ---------------------------------------------------------------------------
# Promoted from ARG to ENV so the runtime reads the same value config.py does,
# and so the download below can take it from os.environ rather than relying on
# shell interpolation inside a python -c string.
ARG EMBEDDING_MODEL=sentence-transformers/all-mpnet-base-v2
ENV EMBEDDING_MODEL=${EMBEDDING_MODEL}
RUN HF_HUB_OFFLINE=0 TRANSFORMERS_OFFLINE=0 python -c "import os; from sentence_transformers import SentenceTransformer; SentenceTransformer(os.environ['EMBEDDING_MODEL'])"

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
COPY src/ src/
COPY main.py ./
RUN pip install --no-cache-dir --no-deps .

# Azure Container Apps routes to whatever this is set to; keep it in sync with
# the --target-port passed to `az containerapp create`.
ENV PORT=8000
EXPOSE 8000

# Single worker: the embedding model is ~420 MB resident, so extra workers
# multiply memory rather than throughput. Scale with ACA replicas instead.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1"]
