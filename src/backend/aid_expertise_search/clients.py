from sentence_transformers import SentenceTransformer
from langchain_openai import ChatOpenAI
from os import getenv
from dotenv import load_dotenv
import bm25s

load_dotenv()

openai_api_key = getenv("OPENAI_API_KEY")
embedding_model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
strong_client = ChatOpenAI(model="gpt-4.1", temperature = 0.0, openai_api_key = openai_api_key)
medium_client = ChatOpenAI(model="gpt-4.1-mini", temperature = 0.0, openai_api_key = openai_api_key)
weak_client = ChatOpenAI(model="gpt-4.1-nano", temperature = 0.0, openai_api_key = openai_api_key)
answer_client = ChatOpenAI(model="gpt-4.1-mini", temperature = 0.0, openai_api_key = openai_api_key, tags = ["answer"])
bm25_retriever = bm25s.BM25.load("src/aid_expertise_search/datasets/bm25")