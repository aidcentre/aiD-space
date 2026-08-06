"""
In-memory retrieval over the pickled corpus.

Superseded by Cosmos DB for the deployed backend (see retrieval.py). Kept
because the local Streamlit explorer (app.py -> graph.py) still runs entirely
offline against the pickles, which is useful for inspecting the corpus without
touching Azure. Nothing here is imported by the FastAPI path.
"""

from typing import Union

import numpy as np
import pandas as pd


def max_cosine_for_document(embedded_chunks, vector) -> Union[np.ndarray, np.float64]:
    """
    Computes the maximum cosine similarity between a vector and a set of embedded chunks for each article.
    """
    similarities = np.dot(embedded_chunks, vector)
    norm_product = np.linalg.norm(embedded_chunks, axis=-1) * np.linalg.norm(vector)
    return np.max(similarities / norm_product, axis=-1)


def retrieval(df, vector, n_min=3, n_max=-1) -> pd.DataFrame:
    """
    Retrieves the most relevant documents from the dataframe based on cosine similarity to the given vector
    """

    df["cosine"] = df["chunk_embeddings"].apply(
        lambda x: max_cosine_for_document(x, vector)
    )

    n_docs = len(df)

    closest_cosines = np.sort(df["cosine"])[::-1][: min(n_min, n_docs - 1)]
    threshold = min([0.5, np.mean(closest_cosines) - 0.1, np.min(closest_cosines)])
    if n_max != -1:
        smallest_cosine_allowed = np.sort(df["cosine"])[::-1][
            min(n_max - 1, n_docs - 1)
        ]
        if threshold < smallest_cosine_allowed:
            threshold = smallest_cosine_allowed
    if threshold < 0.2:
        threshold = 0.2

    return df[df["cosine"] >= threshold]


def bm25_retrieval(df, retriever, query, k=0):
    """
    Returns a dataframe of documents, scored after relevance, based on the BM25 algorithm.

    `retriever` is a loaded bm25s.BM25 index. It is passed in rather than read
    from a module global so that the deployed backend never has to load one.
    """
    import bm25s

    query_tokens = bm25s.tokenize(query)
    num_docs = retriever.scores["num_docs"] if k == 0 else k

    docs, scores = retriever.retrieve(query_tokens, sorted=True, k=num_docs)
    doc_numbers, doc_scores = docs[0], scores[0]
    index_to_score = {i: s for i, s in zip(doc_numbers, doc_scores)}

    df["bm25"] = df["index"].apply(lambda x: index_to_score.get(x, 0))
    return df[df["index"].isin(doc_numbers)]


def load_bm25(path: str = "src/aid_expertise_search/datasets/bm25"):
    """Load the on-disk bm25s index."""
    import bm25s

    return bm25s.BM25.load(path)
