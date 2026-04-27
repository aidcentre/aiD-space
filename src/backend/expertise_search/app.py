import streamlit as st
import os

os.environ["OPENAI_API_KEY"] = st.secrets["openai"]["api_key"]

st.set_page_config(
    page_icon="images/sintef_logo_icon.png", page_title="AID Expertise Search"
)

aid_logo, title = st.columns([2, 12])

with aid_logo:
    st.image("images/aid_logo_icon.png")

with title:
    st.markdown("# AID Expertise Search")

from aid_expertise_search import graph

if "query" not in st.session_state:
    st.session_state.query = ""

if "response" not in st.session_state:
    st.session_state.response = ""

if "authors" not in st.session_state:
    st.session_state.authors = []

if "suggestions" not in st.session_state:
    st.session_state.suggestions = []

if "query_suggestions" not in st.session_state:
    st.session_state.query_suggestions = []

if "auto_query" not in st.session_state:
    st.session_state.auto_query = ""

if "auto_author" not in st.session_state:
    st.session_state.auto_author = ""

st.markdown("### This is a :orange[BETA] version, which is still under construction. ")
st.divider()
st.markdown(
    "Hi, I am an expertise search algorithm made by SINTEF for the Norwegian Centre on AI for Decisisions. Write down a research area, and I will quide you to relevant expertise from our researchers."
)

query, button = st.columns([7, 3])
with query:
    query = st.text_area(
        label="Query",
        key="query",
        height=100,
        label_visibility="hidden",
        placeholder="Please write down your query",
    )


def run_graph(state: graph.State = None):

    response_area.markdown("#### Generating answer...")

    if not state:
        if query != "":
            state = graph.State(query=st.session_state.query)

        else:
            return

    else:
        st.session_state.query = state.get("query")

    try:
        state = graph.invoke_graph(state)
        print("Graph Excecuted successfully!\n")

        st.session_state.suggestions = state.get("suggestions", [])
        st.session_state.query_suggestions = state.get("query_suggestions", [])
        st.session_state.response = state.get("text_answer")

        score_dict = state.get("score", {})
        st.session_state.authors = list(
            sorted(
                zip(score_dict.keys(), score_dict.values()),
                key=lambda x: x[1],
                reverse=True,
            )
        )
    except:
        st.session_state.suggestions = []
        st.session_state.query_suggestions = []
        st.session_state.response = (
            "Something went wrong, please try again with a different query."
        )
        st.session_state.authors = []


def reset_func():
    st.session_state.query = ""
    st.session_state.response = ""
    st.session_state.authors = []
    st.session_state.suggestions = []
    st.session_state.query_suggestions = []
    st.session_state.auto_query = ""
    st.session_state.auto_author = ""


def author_pills_callback():
    if st.session_state.get("auto_author"):
        state = graph.State(
            query=f"Give me a brief summary of what work {st.session_state.get('auto_author')} does"
        )
        run_graph(state)


def query_pills_callback():
    if st.session_state.get("auto_query"):
        state = graph.State(query=st.session_state.get("auto_query"))
        run_graph(state)


def create_suggestions():

    if len(st.session_state.query_suggestions):
        st.markdown("#### Query Suggestions")
        st.pills(
            label="Find out more about these topics",
            options=st.session_state.query_suggestions,
            selection_mode="single",
            label_visibility="hidden",
            key="auto_query",
            on_change=query_pills_callback,
        )

    if len(st.session_state.suggestions):
        st.markdown("#### Suggested Authors")
        st.pills(
            label="Find out more about the authors",
            options=st.session_state.suggestions,
            selection_mode="single",
            label_visibility="hidden",
            key="auto_author",
            on_change=author_pills_callback,
        )


with button:
    st.button(
        label="Generate", on_click=run_graph, type="primary", use_container_width=True
    )
    reset, info = st.columns([1, 1])
    with reset:
        st.button(label="Reset", on_click=reset_func, use_container_width=True)
    with info:
        with st.popover(label="Info", use_container_width=True):
            st.html("""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expertise Search</title>
  <style>
    body {
      font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      background: #f9fafc;
      color: #333;
    }
    header {
      color: #333;
      text-align: center;
      padding: 1em 1em;
    }
    main {
      max-width: 800px;
      margin: 2em auto;
      padding: 0 1em;
    }
    h1 {
      margin: 0;
      font-size: 2em;
      color: #113d65;
    }
    p {
      margin: 1em 0;
    }
    footer {
      text-align: center;
      padding: 2em 0;
      color: #777;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <header>
    <h1>AID Expertise Search</h1>
  </header>

  <main>
    <h2>General Information</h2>
    <p>
        The expertise search tool allows you to explore and ask questions about researchers involved in the Norwegian Research Center
        AID - AI for Decisions. The purpose is to connect different research areas to specific researchers.
        The data behind the application is a collection of scientific articles uploaded by each researcher involved.
        The search tool works by comparing the query with all of the articles, and picking out the most relevant ones.
        The tool then generates an answer based on the query and the relevant articles. This technology is known as RAG.
        In addition, all articles are ranked in relevance to the query, in order to give each researcher a relevance score.            
    </p>

    <h2>What You Can Ask About</h2>
    <p>
      With this beta version, the tool is best at answering two kinds of questions.
    </p>
    <ul>
      <li><em>Queries mentioning specific researchers - ex. “What does Ola Nordmann study?”</em></li>
      <li><em>Queries mentioning specific research areas - ex. “Who is best suited to help with big data analytics?”</em></li>
    </ul>

    <h2>Get Started</h2>
    <p>
      Simply enter your question about a topic or a specific researcher, and hit generate to begin exploring the expertise of AID researchers.
    </p>
  </main>

  <footer>
  <p>
    Made in 2025 by SINTEF Digital
  </p>
</footer>

</body>
</html>

""")
            _, im, _ = st.columns([1, 1, 1])
            with im:
                st.image("images/sintef_logo.png")

response_area = st.markdown(st.session_state.response)

if st.session_state.response:
    st.divider()

if len(st.session_state.authors):
    st.markdown(
        "#### Based on the retrieved articles, I would recommend reaching out to: "
    )

for i, (a, s) in enumerate(st.session_state.authors):
    if i < 5:
        author_box, score_box = st.columns([1, 1])
        with author_box:
            st.markdown(f"**{a.replace('_', ' ')}**")
        with score_box:
            st.markdown(f"With a relevance score of :orange[{str(round(s))}]")

create_suggestions()
