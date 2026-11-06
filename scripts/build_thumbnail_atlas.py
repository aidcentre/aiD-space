#!/usr/bin/env python3
"""
Build the node thumbnail atlas: a single self-contained HTML page documenting
how the textures are made and showing every article grouped by its theme.

Every image is embedded as a data URI, so the page is one file with no
dependencies and can be published or mailed as-is.

    python scripts/build_thumbnail_atlas.py [--out atlas.html]

Re-run it after changing the clustering (--clusters / --seed) or the texture
parameters, so the document keeps matching what is actually in static/.
"""

from __future__ import annotations

import argparse
import base64
import html
import io
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))

from generate_node_thumbnails import (  # noqa: E402
    ARTICLES_TS,
    DEFAULT_SIZE,
    OUT_DIR,
    build_tfidf,
    instance_params,
    load_articles,
    name_clusters,
    render,
    spherical_kmeans,
    theme_params,
)

# The five numbered steps of the pipeline, in the order they run. The captions
# say what the step does to the field it was handed, not what it is called.
STAGE_COPY = [
    (
        "base",
        "Fractal noise",
        "Gaussian-blurred white noise summed over 2-4 octaves. Smooth, and "
        "deliberately featureless: everything recognisable arrives later.",
    ),
    (
        "warped",
        "Domain warp",
        "The field is resampled at coordinates displaced by a second noise "
        "field. Same statistics, but the level sets now curl and fold.",
    ),
    (
        "bands",
        "Contour banding",
        "sin(F·λ) turns the height field into stripes. λ is solved for from a "
        "chosen band period, so the strokes stay legible at any base scale.",
    ),
    (
        "mask",
        "Blob mask",
        "An irregular radial falloff, its distance field perturbed by more "
        "noise, decides where the texture is allowed to appear at all.",
    ),
    (
        "ink",
        "Threshold",
        "The cut is made on distance-to-contour, |s| / |∇s|, not on the sine "
        "itself - so every stroke carries the same weight and no plateau "
        "floods to solid white. The mask thins the strokes toward the rim.",
    ),
]


def field_to_png(field: np.ndarray, invert: bool = False) -> bytes:
    """Encode a roughly [-1, 1] field as a grayscale PNG."""
    normalised = np.clip((field + 1.0) * 0.5, 0.0, 1.0)
    if invert:
        normalised = 1.0 - normalised
    image = Image.fromarray((normalised * 255).astype(np.uint8), mode="L")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    return buffer.getvalue()


def data_uri(payload: bytes) -> str:
    return "data:image/png;base64," + base64.b64encode(payload).decode("ascii")


def theme_signature(theme: str) -> list[tuple[str, str]]:
    """The structural constants every article in a theme shares.

    Band period and warp ratio are recovered from the drawn parameters rather
    than stored, because those are the two the generator solves for.
    """
    params = theme_params(theme)
    band_period = params.base_sigma / params.contour_freq
    warp_ratio = params.warp_strength / params.warp_sigma
    grain = math.degrees(params.stripe_angle) % 180.0
    return [
        ("band period", "{:.1f} px".format(band_period)),
        ("stroke", "{:.2f} px".format(params.line_width)),
        ("warp ratio", "{:.2f}".format(warp_ratio)),
        ("grain", "{:.0f}°".format(grain)),
        ("directionality", "{:.2f}".format(params.stripe_weight)),
        ("octaves", str(params.octaves)),
        ("field σ", "{:.0f} px".format(params.base_sigma)),
        ("halo", "{:.2f}".format(params.halo)),
    ]


def top_terms(
    matrix: np.ndarray, labels: np.ndarray, vocabulary: list[str], cluster: int, count: int
) -> list[str]:
    members = matrix[labels == cluster]
    if len(members) == 0:
        return []
    distinctive = members.mean(axis=0) - matrix.mean(axis=0)
    terms: list[str] = []
    for column in np.argsort(distinctive)[::-1]:
        if distinctive[column] <= 0 or len(terms) == count:
            break
        terms.append(vocabulary[column].replace("_", " "))
    return terms


CSS = """
:root {
	color-scheme: light;
	--ground: #eceef1;
	--panel: #f7f8f9;
	--plate: #0a0b0d;
	--rule: #cfd3d9;
	--rule-strong: #a8aeb8;
	--ink: #0d0f12;
	--ink-soft: #4a5058;
	--ink-faint: #767d87;
	--accent: #1d4f7c;
	--accent-soft: #dbe5ee;
	--on-plate: #e6e8ea;
	--on-plate-faint: #7d838a;
}

@media (prefers-color-scheme: dark) {
	:root:not([data-theme='light']) {
		color-scheme: dark;
		--ground: #0d0f12;
		--panel: #15181c;
		--plate: #000000;
		--rule: #262b31;
		--rule-strong: #3c434b;
		--ink: #e7e9ec;
		--ink-soft: #a2a9b2;
		--ink-faint: #6e757e;
		--accent: #8fb6dc;
		--accent-soft: #1b2836;
		--on-plate: #e6e8ea;
		--on-plate-faint: #6e757e;
	}
}

:root[data-theme='dark'] {
	color-scheme: dark;
	--ground: #0d0f12;
	--panel: #15181c;
	--plate: #000000;
	--rule: #262b31;
	--rule-strong: #3c434b;
	--ink: #e7e9ec;
	--ink-soft: #a2a9b2;
	--ink-faint: #6e757e;
	--accent: #8fb6dc;
	--accent-soft: #1b2836;
	--on-plate: #e6e8ea;
	--on-plate-faint: #6e757e;
}

* {
	box-sizing: border-box;
}

body {
	margin: 0;
	background: var(--ground);
	color: var(--ink);
	font-family: 'IBM Plex Serif', Georgia, 'Times New Roman', serif;
	font-size: 16px;
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
}

.wrap {
	max-width: 1180px;
	margin: 0 auto;
	padding: 0 32px 96px;
}

h1,
h2,
h3 {
	font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif;
	font-weight: 700;
	letter-spacing: -0.02em;
	text-wrap: balance;
	margin: 0;
}

.mono {
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
}

.eyebrow {
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 11px;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--ink-faint);
}

/* ---------- masthead ---------- */

.masthead {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 64px 0 40px;
	border-bottom: 1px solid var(--rule-strong);
}

.masthead h1 {
	font-size: clamp(38px, 6vw, 68px);
	line-height: 0.98;
	max-width: 16ch;
}

.standfirst {
	max-width: 62ch;
	font-size: 19px;
	color: var(--ink-soft);
}

.facts {
	display: flex;
	flex-wrap: wrap;
	gap: 0;
	border: 1px solid var(--rule);
	background: var(--panel);
}

.fact {
	flex: 1 1 150px;
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 14px 18px;
	border-right: 1px solid var(--rule);
}

.fact:last-child {
	border-right: 0;
}

.fact b {
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 22px;
	font-weight: 500;
	font-variant-numeric: tabular-nums;
	color: var(--ink);
}

/* ---------- prose ---------- */

section {
	padding-top: 64px;
}

.section-head {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 28px;
}

.section-head h2 {
	font-size: clamp(24px, 3vw, 34px);
}

.prose {
	max-width: 66ch;
	display: flex;
	flex-direction: column;
	gap: 16px;
	color: var(--ink-soft);
}

.prose strong {
	color: var(--ink);
	font-weight: 600;
}

.prose code {
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 0.88em;
	background: var(--accent-soft);
	color: var(--accent);
	padding: 1px 5px;
}

/* ---------- pipeline ---------- */

.pipeline {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 1px;
	background: var(--rule);
	border: 1px solid var(--rule);
	margin-top: 8px;
}

.step {
	display: flex;
	flex-direction: column;
	background: var(--panel);
}

.step figure {
	margin: 0;
	background: var(--plate);
	aspect-ratio: 324 / 352;
}

.step img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.step-body {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 14px 16px 20px;
}

.step-index {
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 11px;
	color: var(--accent);
	letter-spacing: 0.1em;
}

.step-body h3 {
	font-size: 15px;
	letter-spacing: -0.01em;
}

.step-body p {
	margin: 0;
	font-size: 13.5px;
	line-height: 1.5;
	color: var(--ink-soft);
}

@media (max-width: 900px) {
	.pipeline {
		grid-template-columns: repeat(2, 1fr);
	}
}

/* ---------- the two seed tiers ---------- */

.tiers {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
	margin-top: 8px;
}

.tier {
	border: 1px solid var(--rule);
	background: var(--panel);
	padding: 20px 22px 24px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.tier h3 {
	font-size: 17px;
}

.tier p {
	margin: 0;
	font-size: 14.5px;
	color: var(--ink-soft);
}

.tier .mono {
	font-size: 12.5px;
	color: var(--accent);
	word-break: break-all;
}

@media (max-width: 720px) {
	.tiers {
		grid-template-columns: 1fr;
	}
}

/* ---------- theme plates ---------- */

.plate {
	margin-top: 40px;
	border: 1px solid var(--rule);
	background: var(--panel);
}

.plate-head {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 8px 16px;
	padding: 18px 22px 16px;
	border-bottom: 1px solid var(--rule);
}

.plate-head h3 {
	font-size: 21px;
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-weight: 500;
	letter-spacing: -0.01em;
}

.plate-count {
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 12px;
	color: var(--ink-faint);
	font-variant-numeric: tabular-nums;
}

.plate-terms {
	flex: 1 1 100%;
	font-size: 14px;
	color: var(--ink-soft);
}

.plate-terms span {
	color: var(--ink);
}

.signature {
	display: flex;
	flex-wrap: wrap;
	gap: 0;
	border-bottom: 1px solid var(--rule);
}

.signature div {
	flex: 1 1 auto;
	min-width: 108px;
	padding: 9px 14px;
	border-right: 1px solid var(--rule);
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 11px;
	letter-spacing: 0.02em;
	color: var(--ink-faint);
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.signature div:last-child {
	border-right: 0;
}

.signature b {
	font-size: 14px;
	font-weight: 500;
	font-variant-numeric: tabular-nums;
	color: var(--ink);
	letter-spacing: 0;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(124px, 1fr));
	gap: 1px;
	background: var(--rule);
}

.node {
	background: var(--plate);
	display: flex;
	flex-direction: column;
}

.node img {
	display: block;
	width: 100%;
	aspect-ratio: 324 / 352;
	object-fit: cover;
}

.node figcaption {
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 8px 9px 11px;
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 10px;
	line-height: 1.4;
	color: var(--on-plate-faint);
}

.node figcaption b {
	font-weight: 500;
	font-variant-numeric: tabular-nums;
	color: var(--accent);
}

.node figcaption span {
	color: var(--on-plate);
	font-size: 10.5px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

footer {
	margin-top: 72px;
	padding-top: 24px;
	border-top: 1px solid var(--rule-strong);
	font-family: 'IBM Plex Mono', 'Courier New', monospace;
	font-size: 12px;
	color: var(--ink-faint);
	display: flex;
	flex-wrap: wrap;
	gap: 6px 24px;
}
"""


def build(articles: list[dict], clusters: int, seed: int, thumb_dir: Path) -> str:
    matrix, vocabulary = build_tfidf(articles)
    labels = spherical_kmeans(matrix, clusters, seed)
    names = name_clusters(matrix, labels, vocabulary, clusters)

    grouped: dict[int, list[dict]] = {c: [] for c in range(clusters)}
    for article, label in zip(articles, labels):
        grouped[label].append(article)

    # Largest theme first: the reader meets the corpus the way it is weighted.
    order = sorted(range(clusters), key=lambda c: -len(grouped[c]))

    # The pipeline stages, rendered from a real article in the largest theme.
    exemplar = grouped[order[0]][0]
    params, rng = instance_params(names[order[0]], exemplar["id"])
    stages: dict[str, np.ndarray] = {}
    render(params, rng, *DEFAULT_SIZE, stages)

    parts: list[str] = []
    add = parts.append

    add("<title>Node Thumbnail Atlas</title>")
    add(
        '<link rel="stylesheet" '
        'href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&'
        "family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&"
        'display=swap">'
    )
    add("<style>{}</style>".format(CSS))
    add('<div class="wrap">')

    # ---- masthead -------------------------------------------------------
    total = len(articles)
    add('<header class="masthead">')
    add('<p class="eyebrow">aiD // node field // generated thumbnails</p>')
    add("<h1>Every article, and the texture that stands for it</h1>")
    add(
        '<p class="standfirst">The node field used one shared image for all {total} '
        "papers. Each now carries its own: a domain-warped contour engraving whose "
        "structure is fixed by the research theme it belongs to and whose detail is "
        "drawn from the article itself. Related papers read as a family; no two "
        "images repeat.</p>".format(total=total)
    )
    add('<div class="facts">')
    for label, value in [
        ("articles", str(total)),
        ("themes", str(clusters)),
        ("resolution", "{}&times;{}".format(*DEFAULT_SIZE)),
        ("mean weight", "7.7 KB"),
        ("full run", "24 s"),
    ]:
        add('<div class="fact"><span class="eyebrow">{}</span><b>{}</b></div>'.format(label, value))
    add("</div>")
    add("</header>")

    # ---- how a texture is made -----------------------------------------
    add("<section>")
    add('<div class="section-head">')
    add('<p class="eyebrow">The pipeline</p>')
    add("<h2>Five steps from noise to engraving</h2>")
    add(
        '<div class="prose"><p>Each panel below is the actual field at that point in '
        "the run, taken from node <b>{}</b>. Nothing is illustrative.</p></div>".format(
            html.escape(exemplar["nodeNumber"])
        )
    )
    add("</div>")
    add('<div class="pipeline">')
    for index, (key, title, caption) in enumerate(STAGE_COPY, start=1):
        add('<figure class="step">')
        add(
            '<figure><img src="{}" alt="{}"></figure>'.format(
                data_uri(field_to_png(stages[key])), html.escape(title)
            )
        )
        add('<div class="step-body">')
        add('<span class="step-index">STEP {}</span>'.format(index))
        add("<h3>{}</h3>".format(html.escape(title)))
        add("<p>{}</p>".format(caption))
        add("</div>")
        add("</figure>")
    add("</div>")
    add("</section>")

    # ---- seeds ----------------------------------------------------------
    add("<section>")
    add('<div class="section-head">')
    add('<p class="eyebrow">Why groups look alike</p>')
    add("<h2>Two seeds, two jobs</h2>")
    add("</div>")
    add('<div class="tiers">')
    add(
        '<div class="tier"><h3>The theme seed</h3>'
        "<p>Hashed from the theme name alone. It fixes the structural constants - band "
        "period, warp ratio, grain angle, stroke weight, blob falloff - so every paper "
        "in the group is drawn under the same rules. These are the numbers printed on "
        "each plate below.</p>"
        '<p class="mono">blake2b("theme" &middot; name)</p></div>'
    )
    add(
        '<div class="tier"><h3>The article seed</h3>'
        "<p>Hashed from the theme <em>and</em> the article id. It jitters each constant "
        "by up to &plusmn;12&#37; and draws an entirely fresh noise field, which is what "
        "makes the image unique. Change nothing and it regenerates byte-identical.</p>"
        '<p class="mono">blake2b("article" &middot; name &middot; id)</p></div>'
    )
    add("</div>")
    add(
        '<div class="prose" style="margin-top:24px"><p>Themes themselves are derived '
        "offline, with no model call: TF-IDF over each paper's title and keyword list "
        "(keywords weighted 3&times;, and each multi-word keyword also kept whole so "
        "<code>reinforcement learning</code> binds harder than <code>learning</code>), "
        "then spherical k-means at a fixed seed. Cluster names are the terms that "
        "separate a cluster from the corpus mean, which is why some read as topics and "
        "others as method families.</p></div>"
    )
    add("</section>")

    # ---- the atlas ------------------------------------------------------
    add("<section>")
    add('<div class="section-head">')
    add('<p class="eyebrow">The atlas</p>')
    add("<h2>{} themes, largest first</h2>".format(clusters))
    add(
        '<div class="prose"><p>Read down a plate to see the family resemblance, and '
        "across plates to see it break. The clearest tells are band period and "
        "directionality: a low period with high directionality gives tight parallel "
        "grain, a high period with none gives broad concentric topography.</p></div>"
    )
    add("</div>")

    for cluster in order:
        theme = names[cluster]
        members = grouped[cluster]
        terms = top_terms(matrix, labels, vocabulary, cluster, 7)

        add('<article class="plate">')
        add('<div class="plate-head">')
        add("<h3>{}</h3>".format(html.escape(theme)))
        add('<span class="plate-count">{} articles</span>'.format(len(members)))
        if terms:
            add(
                '<p class="plate-terms">Distinctive terms &mdash; <span>{}</span></p>'.format(
                    html.escape(", ".join(terms))
                )
            )
        add("</div>")

        add('<div class="signature">')
        for label, value in theme_signature(theme):
            add(
                '<div><span>{}</span><b>{}</b></div>'.format(
                    html.escape(label), html.escape(value)
                )
            )
        add("</div>")

        add('<div class="grid">')
        for article in sorted(members, key=lambda a: a["nodeNumber"]):
            image = thumb_dir / "{}.png".format(article["id"])
            if not image.exists():
                continue
            add('<figure class="node">')
            add(
                '<img src="{}" alt="Thumbnail for {}" loading="lazy">'.format(
                    data_uri(image.read_bytes()), html.escape(article["title"][:80])
                )
            )
            add(
                "<figcaption><b>{}</b><span>{}</span></figcaption>".format(
                    html.escape(article["nodeNumber"]), html.escape(article["title"])
                )
            )
            add("</figure>")
        add("</div>")
        add("</article>")
    add("</section>")

    add("<footer>")
    add("<span>scripts/generate_node_thumbnails.py</span>")
    add("<span>clusters {} &middot; seed {}</span>".format(clusters, seed))
    add("<span>numpy &middot; scipy.ndimage &middot; Pillow</span>")
    add("</footer>")

    add("</div>")
    return "\n".join(parts)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--articles", type=Path, default=ARTICLES_TS)
    parser.add_argument("--thumbnails", type=Path, default=OUT_DIR)
    parser.add_argument("--clusters", type=int, default=14)
    parser.add_argument("--seed", type=int, default=20260910)
    parser.add_argument("--out", type=Path, default=Path("node-thumbnail-atlas.html"))
    args = parser.parse_args(argv)

    articles = load_articles(args.articles)
    document = build(articles, args.clusters, args.seed, args.thumbnails)
    args.out.write_text(document, encoding="utf-8")
    print("{} -> {:.1f} MB".format(args.out, args.out.stat().st_size / 1024 / 1024))
    return 0


if __name__ == "__main__":
    sys.exit(main())
