from aid_expertise_search.clients import embedding_model
from aid_expertise_search.functions import read_pdf_to_chunks
import pandas as pd
import os
import bm25s

print(f"""
There are two options for preparing the dataset
      
- 1. You can either manually download the dataset and label it 'expertise_articles', such that the repository path to a researcher is 'expertise_articles/<researcher name>'
- 2. You can automatically download the dataset, thus needing to sign in to show that you have access to the documents.
      
""")


testing = False

input_number = "0"

while "1" not in input_number and "2" not in input_number:
    input_number = input("Please enter the number corresponding to the option: ")


if "2" in input_number:
    raise NotImplementedError(f"""
Automatic download not implemented yet
""")

    from office365.sharepoint.client_context import ClientContext
    import msal

    from dotenv import load_dotenv

    load_dotenv()

    CLIENT_ID = os.getenv("SHAREPOINT_CLIENT_ID")
    CLIENT_SECRET = os.getenv("SHAREPOINT_CLIENT_SECRET")
    TENANT_ID = os.getenv("TENANT_ID")

    SITE_URL = "https://studntnu.sharepoint.com/sites/o365_AIforDecision2"
    AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
    SCOPES = ["https://graph.microsoft.com/Sites.Read.All"]

    app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)

    flow = app.initiate_device_flow(scopes=SCOPES)

    if "user_code" not in flow:
        raise Exception("Failed to create device flow")

    print(flow["message"])

    result = app.acquire_token_by_device_flow(flow)

    if "access_token" not in result:
        raise Exception(result)

    access_token = result["access_token"]

    ctx = ClientContext(SITE_URL).with_access_token(access_token)
    web = ctx.web.get().execute_query()

    print("Connected to site:", web.properties["Title"])

else:
    print(f"""
Starting embedding with manual download
""")

if testing:
    folder_path = "test_expertise_articles"
else:
    folder_path = "expertise_articles"

df = {
    "name": [],
    "title": [],
    "type": [],
    "full_text": [],
    "chunks": [],
    "full_text_embedding": [],
    "chunk_embeddings": [],
}

researcher_df = {"name": [], "google_scholar": [], "web_page": [], "orcid_id": []}

name_paths = os.listdir(folder_path)
total_number_of_files = 0
information_file_name = "Input_information.md"

if information_file_name in name_paths:
    name_paths.remove(information_file_name)

for n_p in name_paths:
    full_name_path = f"{folder_path}/{n_p}"
    file_paths = os.listdir(full_name_path)
    total_number_of_files += len(file_paths)

researchers = set()
researchers_with_txt_file = set()

i = 0
unsuccessfull_documents = 0
problematic_documents = 0

for n_p in name_paths:
    researchers.add(n_p)
    full_name_path = f"{folder_path}/{n_p}"
    file_paths = os.listdir(full_name_path)
    for f_p in file_paths:
        i += 1
        print(f"{int(i * 100 / total_number_of_files)}\t% done", end="\r")
        full_document_path = f"{full_name_path}/{f_p}"
        if ".pdf" == f_p[-4:]:
            try:
                full_text, chunks = read_pdf_to_chunks(full_document_path)
                embeddings = embedding_model.encode([full_text] + chunks)
                full_text_embedding = embeddings[0]
                chunk_embeddings = embeddings[1:]

                df["name"].append(n_p)
                df["title"].append(f_p)
                df["full_text"].append(full_text)
                df["chunks"].append(chunks)
                df["full_text_embedding"].append(full_text_embedding)
                df["chunk_embeddings"].append(chunk_embeddings)

                presentation_check_name = "presentation"

                if presentation_check_name == f_p[: len(presentation_check_name)]:
                    df["type"].append(presentation_check_name)
                else:
                    df["type"].append("normal")

            except:
                unsuccessfull_documents += 1

        if ".txt" == f_p[-4:]:
            if n_p in researchers_with_txt_file:
                continue

            researchers_with_txt_file.add(n_p)

            try:
                with open(full_document_path, "r") as file:
                    links = file.read().split()

                    google_scholar = ("", False)
                    web_page = ("", False)
                    orcid_id = ("", False)

                    problematic_line = 0

                    for l in links:
                        if "scholar.google.com" in l and google_scholar[1] == False:
                            google_scholar = (l, True)
                            continue
                        if "orcid.org" in l and orcid_id[1] == False:
                            orcid_id = (l, True)
                            continue
                        if web_page[1] == False:
                            web_page = (l, True)
                            continue

                        problematic_line += 1

                    problematic_documents = problematic_documents + bool(
                        problematic_line
                    )
                    researcher_df["name"].append(n_p)

                    if google_scholar[1]:
                        researcher_df["google_scholar"].append(google_scholar[0])
                    else:
                        researcher_df["google_scholar"].append("")

                    if orcid_id[1]:
                        researcher_df["orcid_id"].append(orcid_id[0])
                    else:
                        researcher_df["orcid_id"].append("")

                    if web_page[1]:
                        researcher_df["web_page"].append(web_page[0])
                    else:
                        researcher_df["web_page"].append("")

            except:
                unsuccessfull_documents += 1
                problematic_documents += 1

    if n_p not in researchers_with_txt_file:
        researcher_df["name"].append(n_p)
        researcher_df["google_scholar"].append("")
        researcher_df["orcid_id"].append("")
        researcher_df["web_page"].append("")

print("Number of unsuccessfull documents: ", unsuccessfull_documents)
print("Number of problematic .txt files: ", problematic_documents)

df["index"] = [i for i in range(len(df["name"]))]

dataframe = pd.DataFrame(df)
researcher_dataframe = pd.DataFrame(researcher_df)

corpus_tokens_for_bm25 = bm25s.tokenize(df["full_text"])
bm_25_retriever = bm25s.BM25()
bm_25_retriever.index(corpus_tokens_for_bm25)

if testing:
    dataframe.to_pickle("src/aid_expertise_search/datasets/test_documents.pkl")
    researcher_dataframe.to_pickle(
        "src/aid_expertise_search/datasets/test_researcher_information.pkl"
    )
    bm_25_retriever.save(save_dir="src/aid_expertise_search/datasets/test_bm25")

else:
    dataframe.to_pickle("src/aid_expertise_search/datasets/documents.pkl")
    researcher_dataframe.to_pickle(
        "src/aid_expertise_search/datasets/researcher_information.pkl"
    )
    bm_25_retriever.save(save_dir="src/aid_expertise_search/datasets/bm25")
