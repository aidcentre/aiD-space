## AID Expertise Search

### This repository shows the first version of an expertise search for the Norwegian AI center AI for Decisions (AID).

To prepare the program create a new virtual environment, activate it and install the dependencies
```bash
python -m venv .venv
source .venv/bin/activate
pip install -e.
```
To run the program, you will need an openai api key. To actually use the api key, make a copy of the file `example.toml` located in the `.streamlit` folder and enter your openai api key in the `api_key` slot. Rename the file with your api_key `secrets.toml`. It should still be located in the `.streamlit` folder.

### Program Modes
There are two modes for this program. The first mode, **Memory Mode**, is more like a chatbot, where the conversation history is kept between searches.
The other mode, **Normal Mode**, is an application with no memory between searches, where each search takes a brand new start.

#### Memory Mode

Start the program by running
```bash
python memory_app.py
```

#### Normal Mode

Start the program by running
```bash
streamlit run app.py
```

You can see a demo of the project without an api key [here](https://aidexpertisesearch-nrmdnyesl7oppreljp2epb.streamlit.app/)

### Preparing The Dataset

To prepare the dataset, we want to eventually be able to do it fully automatically, however at this point and time, you have to manually download the [Expertise Finder](https://studntnu.sharepoint.com/sites/o365_AIforDecision2/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fo365%5FAIforDecision2%2FShared%20Documents%2FGeneral%2FExpertise%20finder&viewid=dcb3e446%2D7985%2D4b38%2Da494%2Db7f9c06d2534&csf=1&CID=74f0f3a1%2Dc034%2Df000%2D498f%2D6de1fb6b7bed&cidOR=SPO&FolderCTID=0x012000D76C3CD00FF84E47AC7AB11583D376EE) folder from the AiD Sharepoint. Label the folder **expertise_articles**, and have it in this root directory. Then, you can run the python file **embedding_program.py**. You need to install the project dependencies first (i.e. create a venv, activate it and run pip install).

### Some Information About the Retrieval and the Scores

In the preperation of the dataset, each article is divided into smaller documents. Let's call them *chunks*. Each article $i$ in the dataset is given a relevance score, which I've decided to call *article score*. For each article $i$, the article $i$ score is the cosine similarity from the chunk with the highest cosine similarity to the searchword. 

Every researcher is then given a score. This *researcher score* is given by the following formula:

```math
\text{Researcher Score} \propto \frac{\sum_{\text{articles}\:i}\{(1+\text{article}\:i\:\text{score})^{2}-1\}}{(\sum_{\text{articles}\:i})^{\gamma}}
```
where I've introduced a $\gamma$ factor, and chosen $\gamma = 0.2$, but the value of this is something I'm experimenting with.

Both sums goes over each researchers uploaded articles, that have been labeled relevant. Labeled relevant really only means that they have a max cosine similarity score above some threshold that depends on how specific the query is. For example, if the query is pretty spot on certain articles, the threshold will be high, with a maximum threshold at 0.5. On the other hand if the search doesn't find any articles with a high relevance score, the threshold is pretty low, with a minimum of 0.2.

The quadratic term $(1+x)^2-1$ is included to distinguish between "very relevant" articles and "semi-relevant" articles more than cosine similarity would. For example, an article with cosine similarity 0.8 would contribute with a factor of 2.24, whilst an article with cosine similarity 0.4 would contribute with 0.96. For articles of lower relevance, one can simply see from the taylor expansion of the term $(1+x)^2-1$, which is approximately proportional to $x$ for small $x$, that this change doesn't affect these articles too much.

I've had a hard time figuring out a natural balance between "average" score for each relevant researcher, and "total" score for each relevant researcher. I've settled on a middle ground, where I divide on the total number of articles, but taken to the power of some number smaller than $1$, based on this idea:

- Including another relevant article should increase your score, but it should increase your score less if you already have many relevant articles.

If we assume that each new article contributes to the sum in the numerator equally as much as the previous did, we can approximate the researcher score as:

```math
\text{Researcher Score} \propto \frac{an}{n^{\gamma}}
```
Thus, an increment in number of relevant articles are approximately proportional to
```math
\frac{d}{dn}\left\{\frac{an}{n^{\gamma}}\right\} = (1-\gamma)\frac{a}{n^{\gamma}}
```

where $a$ simply is the average value of $(1+\text{article score})^2-1$, and $n$ the number of relevant articles. The $\gamma$ factor is chosen through pure experimentation. I don't have a good reason for why I found $\gamma = 0.2$ a good fit. Intuitively I would have thought that $\gamma$ somewhere closer to $0.5$ would give better results, but maybe that's just because my brain is used to seeing square roots :))

