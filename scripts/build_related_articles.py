#!/usr/bin/env python3
"""
Find the relevant articles shown beneath each open article.

For every article in the corpus this picks up to three others that cover the
same ground, scores each one, and writes the lot to
static/articles/related.json. The node panel fetches that file on demand, the
same way it fetches the abstracts, so none of it lands in the homepage bundle.

Relevance is semantic rather than lexical. The expertise-search backend has
already embedded every chunk of every PDF (sentence-transformers,
all-mpnet-base-v2 -- see src/backend/expertise_search/embedding_program.py)
and keeps the vectors in documents.pkl. Averaging a paper's chunk vectors
gives one vector for the whole paper, and the cosine between two papers is
their relevance score. TF-IDF over titles, keywords and abstracts was tried
first and matched words rather than topics: a paper on graph convolutional
networks found a burr detector built on sparse convolutions.

Two rules keep the lists useful rather than merely similar:

* A paper uploaded by several of its co-authors, or a preprint sitting beside
  its published version, is one work. Records of the same work never
  recommend each other, and one work never takes two places in a list. Two
  records are the same work when they share a DOI, share a title once case
  and punctuation are ignored, or when their text is near-identical.
* Only articles scoring at least --min-score are offered, which is why it is
  "up to" three: an outlier with nothing close gets fewer, not filler.

Re-run this whenever articles.generated.ts is regenerated. The output records
the CORPUS_FINGERPRINT it was built against, and the site warns in the
console when the two disagree.

Stack: numpy and pandas (pandas only to read the backend's pickle). Install
with:

    pip install numpy pandas

Usage (or `npm run articles:related`):

    python scripts/build_related_articles.py            # write related.json
    python scripts/build_related_articles.py --report   # print a sample, write nothing
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_TS = ROOT / "src" / "lib" / "data" / "articles.generated.ts"
DOCUMENTS_PKL = (
    ROOT / "src" / "backend" / "expertise_search" / "src" / "aid_expertise_search"
    / "datasets" / "documents.pkl"
)
OUT_FILE = ROOT / "static" / "articles" / "related.json"

# Two records whose whole-paper vectors are this close are the same text. On
# the current corpus the closest distinct papers sit at 0.944, and a preprint
# and its published version at 0.977.
SAME_WORK_SCORE = 0.97


# ---------------------------------------------------------------------------
# Corpus
# ---------------------------------------------------------------------------


def load_articles(path: Path) -> tuple[list[dict], str]:
    """Pull the JSON array and the corpus fingerprint out of the TS module."""
    source = path.read_text(encoding="utf-8")
    fingerprint = re.search(r"CORPUS_FINGERPRINT = '([^']+)'", source)
    anchor = source.index("export const generatedArticles")
    start = source.index("= [", anchor) + 2
    end = source.rindex("]") + 1
    return json.loads(source[start:end]), fingerprint.group(1) if fingerprint else ""


def unit(vectors: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(vectors, axis=-1, keepdims=True)
    return vectors / np.where(norms == 0, 1.0, norms)


def paper_vectors(articles: list[dict], documents: pd.DataFrame) -> tuple[np.ndarray, list[int]]:
    """One unit vector per article, and the indices of the articles that have one.

    The backend's pickle knows documents only by researcher folder and PDF
    filename, which is exactly the pair every generated article carries -- the
    same join findArticle() falls back on.

    The mean of the chunk vectors stands for the whole paper. The pickle's
    `full_text_embedding` looks like the obvious choice, but the model
    truncates its input at 384 tokens, so that vector only ever saw the
    opening paragraphs.
    """
    rows = {(row.name, row.title): row for row in documents.itertuples(index=False)}
    dimensions = len(documents["full_text_embedding"].iloc[0])
    vectors = np.zeros((len(articles), dimensions))
    found: list[int] = []

    for index, article in enumerate(articles):
        row = rows.get((article["researcher"], article["sourceFile"]))
        if row is None:
            print("  no embeddings for {} -- skipped".format(article["id"]), file=sys.stderr)
            continue
        chunks = np.asarray(row.chunk_embeddings, dtype=np.float64)
        if chunks.ndim == 2 and len(chunks):
            vectors[index] = unit(unit(chunks).mean(axis=0))
        else:
            vectors[index] = unit(np.asarray(row.full_text_embedding, dtype=np.float64))
        found.append(index)

    return vectors, found


# ---------------------------------------------------------------------------
# Same-work detection
# ---------------------------------------------------------------------------


def normalize_title(title: str) -> str:
    text = unicodedata.normalize("NFKD", title).lower()
    return re.sub(r"[^a-z0-9]+", " ", text).strip()


def group_works(articles: list[dict], found: list[int], similarity: np.ndarray) -> list[int]:
    """Label every article with the work it is a record of.

    Union-find, so the rules chain: an arXiv copy that shares a title with one
    upload and a DOI with another pulls all three together.
    """
    parent = list(range(len(articles)))

    def root(i: int) -> int:
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    def join(i: int, j: int) -> None:
        parent[root(i)] = root(j)

    by_key: dict[str, int] = {}
    for i in found:
        article = articles[i]
        keys = ["title:" + normalize_title(article["title"])]
        if article.get("doi"):
            keys.append("doi:" + article["doi"].strip().lower())
        for key in keys:
            if key in by_key:
                join(i, by_key[key])
            else:
                by_key[key] = i

    # Articles without embeddings have zero vectors, so they never qualify.
    for i, j in zip(*np.nonzero(np.triu(similarity >= SAME_WORK_SCORE, k=1))):
        join(int(i), int(j))

    return [root(i) for i in range(len(articles))]


def completeness(article: dict) -> int:
    """How much the card for this record can show. Breaks ties between copies."""
    return sum(bool(article.get(field)) for field in ("doi", "publicationDate", "venue"))


# ---------------------------------------------------------------------------
# Ranking
# ---------------------------------------------------------------------------


def related_for(
    i: int,
    articles: list[dict],
    found: list[int],
    similarity: np.ndarray,
    works: list[int],
    limit: int,
    min_score: float,
) -> list[tuple[int, float]]:
    """The best-matching other works for article `i`, one record each."""
    best: dict[int, tuple[float, int]] = {}
    for j in found:
        work = works[j]
        if work == works[i]:
            continue
        score = float(similarity[i, j])
        held = best.get(work)
        if held is None or score > held[0] + 1e-6:
            best[work] = (score, j)
        elif abs(score - held[0]) <= 1e-6 and completeness(articles[j]) > completeness(
            articles[held[1]]
        ):
            # Byte-identical uploads score identically; show the fuller record.
            best[work] = (score, j)

    ranked = sorted(best.values(), key=lambda pair: (-pair[0], pair[1]))
    return [(j, score) for score, j in ranked if score >= min_score][:limit]


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------


def write_json(path: Path, fingerprint: str, related: dict[str, list[list]]) -> None:
    """One article per line, so a regeneration diffs readably."""
    lines = [
        "{",
        '\t"generatedBy": "scripts/build_related_articles.py",',
        '\t"fingerprint": {},'.format(json.dumps(fingerprint)),
        '\t"related": {',
    ]
    entries = [
        "\t\t{}: {}".format(json.dumps(article_id), json.dumps(items, separators=(",", ":")))
        for article_id, items in related.items()
    ]
    lines.append(",\n".join(entries))
    lines += ["\t}", "}"]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def report(
    articles: list[dict],
    found: list[int],
    works: list[int],
    lists: dict[int, list[tuple[int, float]]],
    limit: int,
    sample: int,
    only: str,
) -> None:
    counts = [0] * (limit + 1)
    for items in lists.values():
        counts[len(items)] += 1
    print("suggestions per article:")
    for size, count in enumerate(counts):
        print("    {}: {:>3}".format(size, count))

    scores = sorted(score for items in lists.values() for _, score in items)
    if scores:
        print(
            "scores: min {:.3f}  p10 {:.3f}  median {:.3f}  max {:.3f}".format(
                scores[0], scores[len(scores) // 10], scores[len(scores) // 2], scores[-1]
            )
        )

    groups: dict[int, list[int]] = {}
    for i in found:
        groups.setdefault(works[i], []).append(i)
    shared = [members for members in groups.values() if len(members) > 1]
    print("\n{} works held as more than one record:".format(len(shared)))
    for members in shared:
        print("    - {}".format(articles[members[0]]["title"][:80]))
        for i in members:
            print("        {}".format(articles[i]["researcher"]))

    chosen = [i for i in found if only in articles[i]["id"]] if only else found
    if not only:
        rng = np.random.default_rng(7)
        picked = rng.choice(len(chosen), size=min(sample, len(chosen)), replace=False)
        chosen = [chosen[int(p)] for p in sorted(picked)]
    for i in chosen:
        print("\n{}  [{}]".format(articles[i]["title"][:90], articles[i]["researcher"]))
        for j, score in lists[i]:
            print("    {:.2f}  {}  [{}]".format(score, articles[j]["title"][:76], articles[j]["researcher"]))
        if not lists[i]:
            print("    (nothing relevant enough)")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--articles", type=Path, default=ARTICLES_TS)
    parser.add_argument("--documents", type=Path, default=DOCUMENTS_PKL)
    parser.add_argument("--out", type=Path, default=OUT_FILE)
    parser.add_argument("--limit", type=int, default=3, help="most suggestions per article")
    parser.add_argument(
        "--min-score", type=float, default=0.5, help="least relevance worth suggesting"
    )
    parser.add_argument("--report", action="store_true", help="print a sample and exit")
    parser.add_argument("--sample", type=int, default=8, help="articles to show in --report")
    parser.add_argument("--only", default="", help="with --report, ids containing this")
    args = parser.parse_args(argv)

    articles, fingerprint = load_articles(args.articles)
    vectors, found = paper_vectors(articles, pd.read_pickle(args.documents))
    similarity = vectors @ vectors.T
    works = group_works(articles, found, similarity)

    lists = {
        i: related_for(i, articles, found, similarity, works, args.limit, args.min_score)
        for i in found
    }

    if args.report:
        report(articles, found, works, lists, args.limit, args.sample, args.only)
        return 0

    related = {
        articles[i]["id"]: [[articles[j]["id"], round(score, 3)] for j, score in items]
        for i, items in lists.items()
    }
    write_json(args.out, fingerprint, related)

    print(
        "{} articles, {} suggestions -> {}".format(
            len(related), sum(len(items) for items in related.values()), args.out
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
