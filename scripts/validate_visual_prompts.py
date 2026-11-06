#!/usr/bin/env python3
"""
Check scripts/data/article_visual_prompts.csv against the article corpus.

The CSV drives the TouchDesigner pipeline that renders each node's looping
WebM thumbnail. It is dropped straight into TouchDesigner as a Table DAT, so
its shape is part of the contract:

* No header, one row per article, in nodeNumber order -- row index N is
  node // 000N, so the Table DAT can be indexed by row number.
* Column 0 is the article id (the output filename); columns 1.. are 3-4
  visual prompts.
* A prompt never contains a comma or a double quote, so every cell survives
  TouchDesigner's plain comma split without any CSV quoting.

The prompts themselves follow one brief: physical objects, visual metaphors,
sci-fi equipment and UI, lighting, materials and atmosphere -- never abstract
corporate or technical jargon. A short banned-word list catches the worst of
it; it warns rather than fails, since a word like "framework" can be a
literal steel frame.

Stack: standard library only.

Usage (or `npm run thumbnails:prompts:check`):

    python scripts/validate_visual_prompts.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_TS = ROOT / "src" / "lib" / "data" / "articles.generated.ts"
PROMPTS_CSV = ROOT / "scripts" / "data" / "article_visual_prompts.csv"

MIN_PROMPTS = 3
MAX_PROMPTS = 4

# Abstract words the brief rules out. Matched as whole words.
JARGON = {
    "compliance", "efficiency", "management", "standardization",
    "standardisation", "optimization", "optimisation", "framework",
    "methodology", "governance", "stakeholder", "synergy", "paradigm",
    "leverage", "utilization", "implementation",
}


def load_article_ids(path: Path) -> list[str]:
    """Article ids in nodeNumber order, read from the generated TS module."""
    source = path.read_text(encoding="utf-8")
    anchor = source.index("export const generatedArticles")
    start = source.index("= [", anchor) + 2
    articles, _ = json.JSONDecoder().raw_decode(source[start:])
    articles.sort(key=lambda a: a["nodeNumber"])
    return [a["id"] for a in articles]


def main() -> int:
    ids = load_article_ids(ARTICLES_TS)
    lines = PROMPTS_CSV.read_text(encoding="utf-8").splitlines()
    errors: list[str] = []
    warnings: list[str] = []

    if len(lines) != len(ids):
        errors.append(f"{len(lines)} rows for {len(ids)} articles")

    for index, line in enumerate(lines):
        where = f"row {index} (node {index:04d})"
        if '"' in line:
            errors.append(f"{where}: contains a double quote")
        cells = [cell.strip() for cell in line.split(",")]
        if index < len(ids) and cells[0] != ids[index]:
            errors.append(f"{where}: id {cells[0]!r}, expected {ids[index]!r}")
        prompts = cells[1:]
        if not MIN_PROMPTS <= len(prompts) <= MAX_PROMPTS:
            errors.append(f"{where}: {len(prompts)} prompts")
        if any(not prompt for prompt in prompts):
            errors.append(f"{where}: empty prompt")
        for prompt in prompts:
            for word in re.findall(r"[a-z]+", prompt.lower()):
                if word in JARGON:
                    warnings.append(f"{where}: jargon {word!r} in {prompt!r}")

    for warning in warnings:
        print(f"warning: {warning}")
    for error in errors:
        print(f"error: {error}")
    if errors:
        return 1
    print(f"ok: {len(lines)} rows, ids aligned with the corpus in nodeNumber order")
    return 0


if __name__ == "__main__":
    sys.exit(main())
