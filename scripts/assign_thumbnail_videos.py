#!/usr/bin/env python3
"""
Decide which looping WebM each node tooltip plays.

The WebMs in static/images/nodes/thumbnails/ are rendered locally, in
TouchDesigner with TouchDiffusion (see Stable_Diffusion_Particles_aiD,
`abstract_video`), from the visual prompts in
scripts/data/article_visual_prompts.csv. Rendering needs a GPU and an
afternoon, so the corpus is not expected to stay fully rendered: an article
added later borrows the video of the closest article that has one, and only
gets its own when someone renders it.

"Closest" is semantic, the same measure build_related_articles.py uses: the
mean of the paper's chunk embeddings (all-mpnet-base-v2, from the expertise
search backend's documents.pkl), compared by cosine. Records of the same work
(shared DOI or title, near-identical text) count as a perfect match. An
article the pickle does not know yet falls back to keyword overlap, plus a
bonus for sharing a research theme with the candidate (themes from
thumbnails/manifest.json).

Output is src/lib/data/thumbnailVideos.generated.ts, which NodeTooltip reads
through thumbnailVideoUrl() in articles.ts. Every src carries a short content
hash, because /images/nodes/* is served immutable for a year: without it a
re-rendered video would never reach a returning visitor.

Run after rendering, and after every regeneration of articles.generated.ts:

    npm run articles:related
    npm run thumbnails:assign

Stack: numpy and pandas, as for build_related_articles.py:

    pip install numpy pandas

Usage (or `npm run thumbnails:assign`):

    python scripts/assign_thumbnail_videos.py            # write the TS module
    python scripts/assign_thumbnail_videos.py --report   # print borrowed videos, write nothing
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_related_articles import (  # noqa: E402  (shares the corpus + embedding code)
    ARTICLES_TS,
    DOCUMENTS_PKL,
    ROOT,
    group_works,
    load_articles,
    paper_vectors,
)

THUMBNAILS = ROOT / "static" / "images" / "nodes" / "thumbnails"
MANIFEST = THUMBNAILS / "manifest.json"
OUT_FILE = ROOT / "src" / "lib" / "data" / "thumbnailVideos.generated.ts"
URL_PREFIX = "/images/nodes/thumbnails/"

# Borrowed matches under this score are worth rendering properly.
WEAK_SCORE = 0.5
THEME_BONUS = 0.25


def content_hash(path: Path) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()[:8]


def keyword_score(a: dict, b: dict, themes: dict[str, str]) -> float:
    """Fallback similarity for an article with no embedding."""
    words_a = {w for k in a.get("keywords", []) for w in re.findall(r"[a-z0-9]+", k.lower())}
    words_b = {w for k in b.get("keywords", []) for w in re.findall(r"[a-z0-9]+", k.lower())}
    union = words_a | words_b
    score = len(words_a & words_b) / len(union) if union else 0.0
    if themes.get(a["id"]) and themes.get(a["id"]) == themes.get(b["id"]):
        score += THEME_BONUS
    return min(score, 1.0)


def assign(articles: list[dict]) -> dict[str, dict]:
    rendered = {i for i, a in enumerate(articles) if (THUMBNAILS / f"{a['id']}.webm").exists()}
    if not rendered:
        return {}

    themes = json.loads(MANIFEST.read_text(encoding="utf-8")).get("themes", {}) if MANIFEST.exists() else {}

    found: list[int] = []
    similarity = np.zeros((len(articles), len(articles)))
    works = list(range(len(articles)))
    if DOCUMENTS_PKL.exists():
        import pandas as pd

        vectors, found = paper_vectors(articles, pd.read_pickle(DOCUMENTS_PKL))
        similarity = vectors @ vectors.T
        works = group_works(articles, found, similarity)
    else:
        print(f"  {DOCUMENTS_PKL.name} not found -- keyword fallback for every article", file=sys.stderr)
    has_vector = set(found)

    assigned: dict[str, dict] = {}
    for i, article in enumerate(articles):
        if i in rendered:
            source, score = i, 1.0
        else:
            def score_against(j: int) -> float:
                if works[i] == works[j]:
                    return 1.0
                if i in has_vector and j in has_vector:
                    return float(similarity[i, j])
                return keyword_score(article, articles[j], themes)

            source = max(rendered, key=lambda j: (score_against(j), -j))
            score = score_against(source)
        source_id = articles[source]["id"]
        video = THUMBNAILS / f"{source_id}.webm"
        assigned[article["id"]] = {
            "src": f"{URL_PREFIX}{source_id}.webm?v={content_hash(video)}",
            "from": source_id,
            "score": round(score, 3),
        }
    return assigned


def write_ts(path: Path, fingerprint: str, assigned: dict[str, dict]) -> None:
    """One article per line, so a regeneration diffs readably.

    Only the URL ships: this lands in the homepage bundle, and which article a
    video was borrowed from is a question for --report, not the browser.
    """
    entries = ",\n".join(
        f"\t{json.dumps(article_id)}: {json.dumps(entry['src'])}" for article_id, entry in assigned.items()
    )
    path.write_text(
        "// Generated by scripts/assign_thumbnail_videos.py -- do not edit by hand.\n"
        "// Article id -> looping WebM for its node tooltip, with a content hash\n"
        "// because /images/nodes/* is cached immutably. See thumbnailVideoUrl().\n\n"
        f"export const THUMBNAIL_VIDEOS_FINGERPRINT = '{fingerprint}';\n\n"
        "export const thumbnailVideos: Record<string, string> = {\n"
        f"{entries}\n"
        "};\n",
        encoding="utf-8",
    )


def report(articles: list[dict], assigned: dict[str, dict]) -> None:
    own = sum(1 for a in articles if assigned.get(a["id"], {}).get("from") == a["id"])
    borrowed = [(a, assigned[a["id"]]) for a in articles if a["id"] in assigned and assigned[a["id"]]["from"] != a["id"]]
    missing = [a for a in articles if a["id"] not in assigned]
    print(f"{own} articles play their own video, {len(borrowed)} borrow one, {len(missing)} have none")
    for article, entry in sorted(borrowed, key=lambda item: item[1]["score"]):
        flag = "  <- worth rendering" if entry["score"] < WEAK_SCORE else ""
        print(f"  {entry['score']:.3f}  {article['id']}\n         borrows {entry['from']}{flag}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--report", action="store_true", help="print the borrowed videos and write nothing")
    args = parser.parse_args(argv)

    articles, fingerprint = load_articles(ARTICLES_TS)
    assigned = assign(articles)
    if not assigned:
        print(f"no rendered videos in {THUMBNAILS}", file=sys.stderr)
        return 1
    report(articles, assigned)
    if not args.report:
        write_ts(OUT_FILE, fingerprint, assigned)
        print(f"wrote {OUT_FILE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
