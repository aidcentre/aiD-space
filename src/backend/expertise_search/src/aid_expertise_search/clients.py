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

embedding_model: SentenceTransformer | None = None
bm25_retriever: bm25s.BM25 | None = None

def load_models():
    global embedding_model, bm25_retriever
    embedding_model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
    bm25_retriever = bm25s.BM25.load("src/aid_expertise_search/datasets/bm25")
