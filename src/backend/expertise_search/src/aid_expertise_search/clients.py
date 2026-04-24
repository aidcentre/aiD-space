from sentence_transformers import SentenceTransformer
from langchain_openai import ChatOpenAI
from os import getenv
from dotenv import load_dotenv
from pydantic import SecretStr
import bm25s

load_dotenv()

openai_api_key = getenv("OPENAI_API_KEY")
api_key = SecretStr(openai_api_key) if openai_api_key else None
strong_client = ChatOpenAI(model="gpt-4.1", temperature=0.0, api_key=api_key)
medium_client = ChatOpenAI(model="gpt-4.1-mini", temperature=0.0, api_key=api_key)
weak_client = ChatOpenAI(model="gpt-4.1-nano", temperature=0.0, api_key=api_key)
answer_client = ChatOpenAI(
    model="gpt-4.1-mini",
    temperature=0.0,
    api_key=api_key,
    tags=["answer"],
)


class _Lazy:
    def __init__(self, factory):
        self._factory = factory
        self._obj = None

    def _load(self):
        if self._obj is None:
            self._obj = self._factory()
        return self._obj

    def __getattr__(self, name):
        return getattr(self._load(), name)


embedding_model = _Lazy(lambda: SentenceTransformer("sentence-transformers/all-mpnet-base-v2"))
bm25_retriever = _Lazy(lambda: bm25s.BM25.load("src/aid_expertise_search/datasets/bm25"))
