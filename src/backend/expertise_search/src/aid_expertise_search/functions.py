from typing import List, Union
import numpy as np
import pandas as pd
from importlib import resources
from aid_expertise_search.classes import AreaOfQuery, Authors, State, MemoryState
from aid_expertise_search.clients import strong_client, bm25_retriever
import bm25s
import pymupdf.layout  # this line is important even if the code interface shows that we don't use it
import pymupdf4llm
import collections
import re
from nltk.corpus import stopwords
from nltk import download as nltk_download

nltk_download("stopwords", quiet=True)
stop_words = set(stopwords.words("english") + ["et", "al", "picture", "text", "x"])


def load_dataframe(filename: str) -> pd.DataFrame:
    """
    Returns pandas Dataframe from pickle file
    """
    with (
        resources.files("aid_expertise_search.datasets")
        .joinpath(filename)
        .open("rb") as f
    ):
        return pd.read_pickle(f)


list_of_aid_researchers = load_dataframe("researcher_information.pkl")["name"].to_list()

"""
Specific Language Model Calls
"""


def get_scientific_area(query: Union[str, List[tuple[str, str]]]) -> AreaOfQuery:
    """
    Returns the specific and overall scientific area of the query.
    If unsure, returns "Other" as the specific area.
    """
    prompt = [
        {
            "role": "system",
            "content": """
               You are going to identify scientific fields mentioned in the user's query.
               You are going to divide the scientific field into a specific field (or subfield) and a more general field.
               If you are unsure what scientific field the user is referring to, return other in both specific and general
               """,
        }
    ]

    if type(query) == str:
        prompt.extend([{"role": "user", "content": query}])
    else:
        prompt.extend(
            [{"role": messager, "content": content} for messager, content in query]
        )

    return strong_client.with_structured_output(AreaOfQuery).invoke(prompt)


def get_authors_name(query: Union[str, List[tuple[str, str]]]) -> Authors:
    """
    Returns the names of the authors mentioned in the query.
    If unsure if an author is mentioned, returns an empty list.
    """
    prompt = [
        {
            "role": "system",
            "content": """
            You are going to extract the names of people mentioned in a user query.
            For example,
            if the query is: "What work is Ola Nordmann an expert in", you should return ['Ola Nordmann'],
            and if the question is:
            "What does Sven Svendsen and Per Hansen do", you should return ['Sven Svendsen', 'Per Hansen'].
            If you are not sure if the query mentions a person,
            return an empty list
            You should only extract names mentioned by a USER in their LATEST MESSAGE.This can be both direct and indirect,
            f.ex. if the AI talked about the word of X, and the user asks "can you tell me a little bit more about their work", you should extract x.
            However, if the user on an earlier occation asked about someone, you should not extract that name unless they also ask about them in the latest message.
            If you extract a name, only that researchers documents will be taken as context.
            """,
        }
    ]

    if type(query) == str:
        prompt.extend([{"role": "user", "content": query}])
    else:
        prompt.extend(
            [{"role": messager, "content": content} for messager, content in query]
        )

    return strong_client.with_structured_output(Authors).invoke(prompt)


"""
Helper functions
"""


def read_pdf_to_chunks(filename: str, chunk_lim: int = -1) -> tuple[str, List[str]]:
    """
    Converts pdf located at filename to chunk_lim to text and chunks.
    Default parameter chunk_lim = -1, which corresponds to seperating the chunks, such that one chunk is one PDF page
    If chunk_lim is set to a different number, it has to be larger than or equal to 100,
    then this is the minimum number of characters in a chunk
    returns (full_text: str, chunks: List[str])
    """
    if chunk_lim == -1:
        pages = [
            page["text"]
            for page in pymupdf4llm.to_text(
                pymupdf.open(filename), page_chunks=True, use_ocr=False
            )
        ]
        return ("\n".join(pages), pages)

    else:
        if chunk_lim < 100:
            raise ValueError("Chunk limit too low!")
        else:
            full_text = pymupdf4llm.to_text(pymupdf.open(filename), use_ocr=False)
            split_text = [
                text
                for text in full_text.split("\n\n")
                if text not in ("", " ", "_", "-")
            ]
            chunks = []
            current_chunk = ""
            for mini_chunk in split_text:
                current_chunk += "\n" + mini_chunk
                if len(current_chunk) > chunk_lim:
                    chunks.append(current_chunk)
                    current_chunk = mini_chunk

            chunks.append(current_chunk)
            return (full_text, chunks)


def split_by_more(string: str, chars: List[str] = []) -> List[str]:
    """
    Almost the same as str.split, only splits by multiple characters,
    and does so by replacing chars[i] with chars[i+1] until the last char,
    which is used to split the string
    """
    if chars == []:
        return string.split()
    else:
        for method, next_method in zip(chars, chars[1:]):
            string = next_method.join(string.split(method))
        return [word for word in string.split(chars[-1]) if word != ""]


def name_in(name: str, name_list: List[str]) -> tuple[str, bool]:
    """
    Checks if name is in name_list, if so returns the name.
    Two names are considered equal if the first letter of the first word in each name is equal,
    and if the last word in each name is equal.
    """
    if name in name_list:
        return name, True

    "Second, check if first name and last name is equal -> If so, regarded as equal"
    name_split = split_by_more(name.lower(), ["_", ".", " "])
    for name_2 in name_list:
        name_2_split = split_by_more(name_2.lower(), ["_", ".", " "])
        if len(name_split) >= 2 and len(name_2_split) >= 2:
            if (
                name_split[0][0] == name_2_split[0][0]
                and name_split[-1] == name_2_split[-1]
            ):
                return name_2, True
    return "", False


def filter_AID_authors(authors: List[str]) -> List[str]:
    """
    Returns list of the names that refer to a researcher in AID
    """

    return_list = []

    for a in authors:
        possible_name, check = name_in(a, name_list=list_of_aid_researchers)
        if check:
            return_list.append(possible_name)

    return return_list


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


def find_mentioned_researchers(
    text_answer: str,
    most_relevant_researchers: List[tuple[str, float]],
    mode: str = "mentioned_most_relevant",
) -> List[str]:
    """
    Returns List of most relevant researchers to generate individual texts about their relevance.
    If mode == 'mentioned_most_relevant'  -> then return the researchers in 'most_relevant_researchers' that are also mentioned in the ai text answer,
    If mode == 'mentioned_aid_list'       -> then return the researchers in 'list_of_aid_researchers' that are also mentioned in the ai text answer
    If mode == 'most_relevant'            -> then return the researchers in 'most_relevant_researchers'
    """

    if mode != "most_relevant":
        words = split_by_more(text_answer, [" ", ".", ","])
        n_grams = []
        for n in range(2, 4):
            for j in range(len(words) - (n - 1)):
                current_word = ""
                for i in range(n):
                    current_word += words[i + j]
                    if i != n - 1:
                        current_word += " "
                n_grams.append(current_word)

        mentioned_researchers = []

        if mode == "mentioned_most_relevant":
            for researcher, score in most_relevant_researchers:
                name, existence = name_in(researcher, n_grams)
                if existence:
                    mentioned_researchers.append(researcher)
        else:
            for researcher in list_of_aid_researchers:
                name, existence = name_in(researcher, n_grams)
                if existence:
                    mentioned_researchers.append(researcher)

        return mentioned_researchers
    else:
        return [r for r, s in most_relevant_researchers]


def get_most_frequent_n_grams(text, n=2, top_n=10):
    """
    Returns the top bigrams in a text as List[tuple(bigram, times)]
    """

    clean_text = re.sub(r"[^a-zA-ZæøåÆØÅ\s]", "", text)
    words = [word for word in clean_text.split() if word not in stop_words]
    bigrams = zip(*[words[i:] for i in range(n)])
    bigram_counts = collections.Counter(bigrams)
    return bigram_counts.most_common(top_n)


def bm25_retrieval(df, query, k=0):
    """
    Returns a dataframe of documents, scored after relevance, based on the BM25 algorithm.

    if k == 0: (default)
        then returns full df, with each document scored
    else:
        then returns the k most relevant documents, with each document scored
    """

    query_tokens = bm25s.tokenize(query)

    if k == 0:
        num_docs = bm25_retriever.scores["num_docs"]
    else:
        num_docs = k

    docs, scores = bm25_retriever.retrieve(query_tokens, sorted=True, k=num_docs)
    doc_numbers, doc_scores = docs[0], scores[0]
    index_to_score = {}

    for i, s in zip(doc_numbers, doc_scores):
        index_to_score[i] = s

    df["bm25"] = df["index"].apply(lambda x: index_to_score.get(x, 0))
    relevant_df = df[df["index"].isin(doc_numbers)]
    return relevant_df


def gather_relevance_score(df, square=True, gamma=0.2):

    authors_article_score = {}
    authors_total_n_papers = {}
    authors_relevance_score = {}
    authors_set = set()

    for a in df["name"]:
        authors_total_n_papers[a] = authors_total_n_papers.get(a, 0) + 1

    for a, score in zip(df["name"], df["score"]):
        authors_set.add(a)
        if square:
            authors_article_score[a] = (
                authors_article_score.get(a, 0) + (1 + score) ** 2 - 1
            )
        else:
            authors_article_score[a] = authors_article_score.get(a, 0) + score

    max_n_papers = 0
    for a in authors_set:
        if authors_total_n_papers[a] > max_n_papers:
            max_n_papers = authors_total_n_papers[a]

    for a in authors_set:
        authors_relevance_score[a] = (
            100
            * authors_article_score[a]
            / (authors_total_n_papers[a] * max_n_papers) ** gamma
        )

    return authors_relevance_score


"""
Nodes for use in both applications
"""


def information_node(state: Union[State, MemoryState]) -> Union[State, MemoryState]:
    """
    Gathers relevant information to give better answer depending on the context given by the users query
    """
    query = state.get("query")
    scientific_area = get_scientific_area(query)
    authors = get_authors_name(query)
    aid_researchers = filter_AID_authors(authors.name_of_employees)
    return {"researchers": aid_researchers, "scientific_area": scientific_area}
