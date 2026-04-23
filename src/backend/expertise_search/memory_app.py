from aid_expertise_search import memory_graph
from aid_expertise_search.classes import MemoryState
import pyfiglet

print(pyfiglet.figlet_format(text="AID  Expertise  Finder"))

messages = []
query = input("USER: ")
total_retrieved_df = None
while query != "":
    messages.extend([("user", query)])
    state = memory_graph.memory_stream_graph(
        MemoryState(query=messages, total_retrieved_df=total_retrieved_df)
    )
    total_retrieved_df = state.get("total_retrieved_df")
    general_researcher_information = state.get("general_researcher_information", [])
    print(state.get("most_relevant_researchers", []))
    messages.extend([("ai", state.get("text_answer"))])
    query = input("USER: ")
