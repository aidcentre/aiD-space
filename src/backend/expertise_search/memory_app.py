"""
Terminal REPL against the same graph the FastAPI backend serves.

Requires the Azure environment (.env), since retrieval now runs against Cosmos.
Conversation history is kept here in the client, matching how the SvelteKit
frontend does it — the graph itself holds no state between turns.
"""

import pyfiglet

from aid_expertise_search import memory_graph
from aid_expertise_search.classes import MemoryState
from aid_expertise_search.clients import load_models
from aid_expertise_search.config import settings

print(pyfiglet.figlet_format(text="AID  Expertise  Finder"))

load_models()

messages: list[tuple[str, str]] = []
query = input("USER: ")
while query != "":
    messages.append(("user", query))
    state = memory_graph.memory_invoke_graph(
        MemoryState(query=messages[-settings.max_history_turns * 2 :])
    )
    text_answer = state.get("text_answer") or ""
    print(f"AI: {text_answer}")
    print(state.get("most_relevant_researchers", []))
    messages.append(("ai", text_answer))
    query = input("USER: ")
