### AID Expertise Search Package

In this folder is the source code package for the AID Expertise Search. The content in this folder is created as a python package with the name `aid_expertise_search`, such that you can access the content of this folder in a python file like this

```python
import aid_expertise_search
```

The source code has 5 five files, and one subdirectory

#### Memory Graph

In the file `memory_graph.py` lies the implementation of the chatbot mode with memory between it's search. There are two important functions for running the expertise search
- `memory_invoke_graph` which takes in a `MemoryState`, runs the application, and returns the `MemoryState` after the application has been run
- `memory_stream_graph` which does the same as memory_invoke_graph, but also prints out the text answer as the language model produces each token. We can modify this to send out the token information, instead of printing it.

#### Graph

In the file `graph.py` lies the implementation of the expertise search with no information kept between searches. The important function for running the expertise search is
- `invoke_graph` which takes in a `State`, runs the application, and returns the `State` after the application has been run

#### Functions, Classes and Clients

In the three files `functions.py`, `clients.py` and `classes.py`, lies the definition of helper-objects
- In **`functions.py`** many different helper functions are defined, such as specific llm calls, and retrieval implementation
- In **`clients.py`** the different embedding models and llm clients are defined
- In **`classes.py`** pydantic `with_structured_output` llm answer classes are defined, and the two states `State` and `MemoryState` are defined

#### Datasets

In this subdirectory, the datasets used to analyze the relevant expertise in the search lies. There are two `.pkl` files
- **`documents.pkl`** which is a pickle file containing a pandas dataframe of the dataset (i.e. articles and so forth)
- **`researcher_information.pkl`** which is a pickle file containing a pandas dataframe of researcher background information (links to google scholar, orcid ID, web page and so forth)
If needed, both of these dataframes can be accessed through the `load_dataframe` function defined in `functions.py` like this

```python
from aid_expertise_search.functions import load_dataframe

documents_dataset = load_dataframe("documents.pkl")
researcher_dataset = load_dataframe("researcher_information.pkl")
```
