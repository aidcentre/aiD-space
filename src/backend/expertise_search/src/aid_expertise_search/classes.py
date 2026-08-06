from typing import Any, List
from typing_extensions import TypedDict
from pydantic import BaseModel, Field
import pandas as pd

"""
Helper Classes (Outputs of Language Model)
"""

class AreaOfQuery(BaseModel):
    specific_area: str = Field(description="The specific scientific area of the query")
    overall_area: str = Field(description="The general scientific area of the query")

class Authors(BaseModel):
    name_of_employees: List[str] = Field(description = "The names of the researchers mentioned in the user query")
    reasoning: List[str] = Field(description = "The reasoning behind including the researchers")

"""
States
"""

class State(TypedDict):
    """Legacy state for the local Streamlit graph (graph.py), which still reads pickles."""
    query: str
    scientific_area: AreaOfQuery
    researchers: List[str]
    score: dict
    retrieved_df: pd.DataFrame
    text_answer: str

class MemoryState(TypedDict):
    """
    State for the deployed FastAPI graph.

    Holds no DataFrames and no cross-request state: retrieval runs fresh on
    every turn against Cosmos, and conversation history arrives from the
    client in `query`. `documents` is a list of retrieval.RankedDocument.
    """
    query: List[tuple[str, str]]
    scientific_area: AreaOfQuery
    researchers: List[str]
    score: dict
    documents: List[Any]
    text_answer: str
    most_relevant_researchers: List[tuple[str, float]]
    general_researcher_information: List[tuple[str, str]]
