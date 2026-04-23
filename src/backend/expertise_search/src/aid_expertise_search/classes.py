from typing import List
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
    query: str
    scientific_area: AreaOfQuery
    researchers: List[str]
    score: dict
    retrieved_df: pd.DataFrame
    text_answer: str

class MemoryState(TypedDict):
    query: List[str]
    scientific_area: AreaOfQuery
    researchers: List[str]
    score: dict
    retrieved_df: pd.DataFrame          # retrieved articles for each message
    total_retrieved_df: pd.DataFrame    # sum of all retrieved articles in a conversation
    text_answer: str
    most_relevant_researchers: List[tuple[str,float]]
    general_researcher_information: List[tuple[str,str]]