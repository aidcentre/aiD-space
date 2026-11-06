#!/usr/bin/env python3
"""
Generate a unique node thumbnail for every article in the corpus.

Replaces the single shared static/images/nodes/node-tooltip-image.png with one
procedural texture per article, written to static/images/nodes/thumbnails/.
The frontend serves them straight out of static/ -- nothing is generated at
runtime and nothing is fetched from a backend.

The look is domain-warped noise pushed through a periodic function and hard
thresholded: a stark black-and-white topography, in the spirit of the original
tooltip image.

Articles are grouped into research themes first, and the theme decides the
*structural* parameters of the texture -- grain direction, contour frequency,
warp strength, blob shape. Two papers on reinforcement learning therefore read
as siblings, while still being pixel-for-pixel distinct, because the noise
seed is drawn per article.

Themes are derived offline with TF-IDF over each title and keyword list
followed by spherical k-means, so the grouping is deterministic and needs no
network or model call. Run with --report to see what the clusters came out as.

Stack: numpy (grids and matrix math), scipy.ndimage (Gaussian noise and the
warp resample), Pillow (encoding). Install with:

    pip install numpy scipy pillow

Usage:

    python scripts/generate_node_thumbnails.py              # all 273
    python scripts/generate_node_thumbnails.py --report     # clusters only
    python scripts/generate_node_thumbnails.py --limit 24 --contact-sheet sheet.png
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import math
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_TS = ROOT / "src" / "lib" / "data" / "articles.generated.ts"
OUT_DIR = ROOT / "static" / "images" / "nodes" / "thumbnails"

# The tooltip renders at 162x176 CSS px with object-fit: cover. Generating at
# exactly 2x that box keeps it crisp on retina, and matching the aspect ratio
# means cover never crops any of the texture away.
DEFAULT_SIZE = (324, 352)  # (width, height)
REFERENCE_WIDTH = 324.0  # the size every length below is quoted in


# ---------------------------------------------------------------------------
# Corpus
# ---------------------------------------------------------------------------


def load_articles(path: Path) -> list[dict]:
    """Pull the JSON array back out of the generated TypeScript module."""
    source = path.read_text(encoding="utf-8")
    anchor = source.index("export const generatedArticles")
    start = source.index("= [", anchor) + 2
    end = source.rindex("]") + 1
    return json.loads(source[start:end])


# ---------------------------------------------------------------------------
# Theme discovery
# ---------------------------------------------------------------------------

STOPWORDS = frozenset(
    """
    a an and are as at be based between by can case does for from has have how
    in into is it its new of on or study studies that the their this to towards
    toward under upon using use used via with within without we our approach
    approaches method methods framework frameworks analysis application
    applications system systems model models modeling modelling paper review
    results two three when where which while
    """.split()
)

TOKEN_RE = re.compile(r"[a-z][a-z0-9+-]{2,}")

# Keywords are assigned per paper and far more discriminative than title prose,
# so they count for more when the vectors are built.
KEYWORD_WEIGHT = 3.0
TITLE_WEIGHT = 1.0


def tokenize(text: str) -> list[str]:
    text = unicodedata.normalize("NFKD", text.lower())
    return [t for t in TOKEN_RE.findall(text) if t not in STOPWORDS]


def article_terms(article: dict) -> dict[str, float]:
    """Bag of weighted terms for one article.

    Each keyword contributes both its individual words and the whole phrase as
    a single term, so "reinforcement learning" pulls papers together more
    strongly than "learning" alone would.
    """
    bag: dict[str, float] = {}

    def add(term: str, weight: float) -> None:
        bag[term] = bag.get(term, 0.0) + weight

    for token in tokenize(article.get("title") or ""):
        add(token, TITLE_WEIGHT)

    for keyword in article.get("keywords") or []:
        tokens = tokenize(keyword)
        for token in tokens:
            add(token, KEYWORD_WEIGHT)
        if len(tokens) > 1:
            add("_".join(tokens), KEYWORD_WEIGHT * 1.5)

    return bag


def build_tfidf(articles: list[dict], min_df: int = 2) -> tuple[np.ndarray, list[str]]:
    """L2-normalised TF-IDF matrix, one row per article."""
    bags = [article_terms(a) for a in articles]

    document_frequency: dict[str, int] = {}
    for bag in bags:
        for term in bag:
            document_frequency[term] = document_frequency.get(term, 0) + 1

    vocabulary = sorted(t for t, df in document_frequency.items() if df >= min_df)
    index = {term: i for i, term in enumerate(vocabulary)}

    n_docs = len(articles)
    idf = np.array(
        [math.log((1 + n_docs) / (1 + document_frequency[t])) + 1.0 for t in vocabulary]
    )

    matrix = np.zeros((n_docs, len(vocabulary)))
    for row, bag in enumerate(bags):
        for term, weight in bag.items():
            column = index.get(term)
            if column is not None:
                matrix[row, column] = 1.0 + math.log(weight)

    matrix *= idf
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return matrix / norms, vocabulary


def spherical_kmeans(
    matrix: np.ndarray, k: int, seed: int, restarts: int = 12, iterations: int = 80
) -> np.ndarray:
    """Cosine k-means with k-means++ seeding. Returns a label per row.

    Rows are already L2-normalised, so a dot product is the cosine similarity
    and "closest centroid" is just an argmax.
    """
    n_docs = matrix.shape[0]
    best_labels: np.ndarray | None = None
    best_score = -np.inf

    for restart in range(restarts):
        rng = np.random.default_rng(seed + restart)

        # k-means++ seeding, over cosine distance.
        centres = [matrix[rng.integers(n_docs)]]
        for _ in range(k - 1):
            similarity = np.max(matrix @ np.array(centres).T, axis=1)
            distance = np.clip(1.0 - similarity, 1e-12, None) ** 2
            centres.append(matrix[rng.choice(n_docs, p=distance / distance.sum())])
        centroids = np.array(centres)

        labels = np.zeros(n_docs, dtype=int)
        for _ in range(iterations):
            similarity = matrix @ centroids.T
            new_labels = np.argmax(similarity, axis=1)
            if np.array_equal(new_labels, labels):
                break
            labels = new_labels
            for cluster in range(k):
                members = matrix[labels == cluster]
                if len(members) == 0:
                    # Re-seed an empty cluster on the worst-fitting document.
                    centroids[cluster] = matrix[np.argmin(np.max(similarity, axis=1))]
                    continue
                centre = members.sum(axis=0)
                norm = np.linalg.norm(centre)
                centroids[cluster] = centre / norm if norm else centre

        score = float(np.sum(np.max(matrix @ centroids.T, axis=1)))
        if score > best_score:
            best_score, best_labels = score, labels.copy()

    assert best_labels is not None
    return best_labels


def name_clusters(
    matrix: np.ndarray, labels: np.ndarray, vocabulary: list[str], k: int
) -> list[str]:
    """Slug each cluster from the terms that distinguish it from the corpus."""
    corpus_mean = matrix.mean(axis=0)
    names: list[str] = []
    used: set[str] = set()

    for cluster in range(k):
        members = matrix[labels == cluster]
        if len(members) == 0:
            names.append("theme-{:02d}".format(cluster))
            continue

        distinctive = members.mean(axis=0) - corpus_mean
        order = np.argsort(distinctive)[::-1]

        parts: list[str] = []
        seen_words: set[str] = set()
        for column in order:
            if distinctive[column] <= 0:
                break
            words = vocabulary[column].split("_")
            if any(word in seen_words for word in words):
                continue
            seen_words.update(words)
            parts.append("-".join(words))
            if len(parts) == 2:
                break

        name = "-".join(parts) or "theme-{:02d}".format(cluster)
        while name in used:
            name = "{}-{:02d}".format(name, cluster)
        used.add(name)
        names.append(name)

    return names


def assign_themes(articles: list[dict], k: int, seed: int) -> tuple[list[str], list[str]]:
    matrix, vocabulary = build_tfidf(articles)
    labels = spherical_kmeans(matrix, k, seed)
    names = name_clusters(matrix, labels, vocabulary, k)
    return [names[label] for label in labels], names


# ---------------------------------------------------------------------------
# Texture parameters
# ---------------------------------------------------------------------------


@dataclass
class TextureParams:
    """Everything that decides how one thumbnail looks.

    Theme-level values are drawn from the theme seed and shared by every
    article in the group; the per-article seed only jitters them and picks a
    fresh noise field, so siblings stay recognisable.
    """

    base_sigma: float
    octaves: int
    lacunarity: float
    gain: float
    anisotropy: float
    warp_strength: float
    warp_sigma: float
    contour_freq: float
    stripe_weight: float
    stripe_angle: float
    stripe_freq: float
    grit: float
    line_width: float
    blob_inner: float
    blob_outer: float
    blob_irregularity: float
    halo: float
    phase: float


def seeded_rng(*parts: str) -> np.random.Generator:
    digest = hashlib.blake2b(b"\x1f".join(p.encode() for p in parts), digest_size=8)
    return np.random.default_rng(int.from_bytes(digest.digest(), "big"))


def theme_params(theme: str) -> TextureParams:
    """The structural rules every article in a theme obeys.

    Two of the knobs are derived rather than drawn, because the interesting
    ranges are relative, not absolute:

    * A smoothed field of correlation length ``sigma`` swings by roughly one
      standard deviation over ``sigma`` pixels, so ``sin(field * freq)`` bands
      it at a period of about ``sigma / freq`` pixels. Picking the band period
      directly and solving for the frequency keeps the strokes legible at
      every base scale -- drawn independently, half the themes come out as
      pixel dust.
    * A warp displaces coordinates by up to ``strength`` over ``warp_sigma``
      pixels, so a ratio above 1 folds the mapping back on itself and shreds
      the contours. Staying under it bends them instead.
    """
    rng = seeded_rng("theme", theme)
    base_sigma = rng.uniform(20.0, 52.0)
    band_period = rng.uniform(4.5, 16.0)  # pixels between strokes, at REFERENCE_WIDTH
    warp_sigma = rng.uniform(16.0, 56.0)
    warp_ratio = rng.uniform(0.15, 0.85)
    blob_inner = rng.uniform(0.20, 0.62)
    return TextureParams(
        base_sigma=base_sigma,
        octaves=int(rng.integers(2, 5)),
        lacunarity=rng.uniform(1.8, 2.5),
        gain=rng.uniform(0.22, 0.45),
        anisotropy=rng.uniform(0.55, 1.85),
        warp_strength=warp_sigma * warp_ratio,
        warp_sigma=warp_sigma,
        contour_freq=base_sigma / band_period,
        stripe_weight=float(rng.uniform(0.0, 1.0) ** 1.7),
        stripe_angle=rng.uniform(0.0, math.pi),
        stripe_freq=rng.uniform(4.0, 22.0),
        grit=rng.uniform(0.02, 0.16),
        line_width=rng.uniform(0.45, 1.35),
        blob_inner=blob_inner,
        blob_outer=blob_inner + rng.uniform(0.30, 0.72),
        blob_irregularity=rng.uniform(0.10, 0.45),
        halo=float(rng.uniform(0.0, 1.0) ** 2 * 0.45),
        phase=rng.uniform(0.0, 1.0),
    )


def instance_params(
    theme: str, article_id: str
) -> tuple[TextureParams, np.random.Generator]:
    """Jitter the theme rules for one article, and hand back its noise RNG."""
    base = theme_params(theme)
    rng = seeded_rng("article", theme, article_id)

    def jitter(value: float, amount: float = 0.12) -> float:
        return float(value * rng.uniform(1.0 - amount, 1.0 + amount))

    params = TextureParams(
        base_sigma=jitter(base.base_sigma),
        octaves=base.octaves,
        lacunarity=jitter(base.lacunarity, 0.06),
        gain=jitter(base.gain, 0.08),
        anisotropy=jitter(base.anisotropy, 0.10),
        warp_strength=jitter(base.warp_strength, 0.18),
        warp_sigma=jitter(base.warp_sigma, 0.15),
        contour_freq=jitter(base.contour_freq, 0.14),
        stripe_weight=base.stripe_weight,
        stripe_angle=base.stripe_angle + float(rng.uniform(-0.22, 0.22)),
        stripe_freq=jitter(base.stripe_freq, 0.15),
        grit=jitter(base.grit, 0.22),
        line_width=float(np.clip(jitter(base.line_width, 0.14), 0.32, 1.90)),
        blob_inner=jitter(base.blob_inner, 0.18),
        blob_outer=max(jitter(base.blob_outer, 0.12), jitter(base.blob_inner, 0.18) + 0.2),
        blob_irregularity=jitter(base.blob_irregularity, 0.25),
        halo=jitter(base.halo, 0.3),
        phase=float(rng.uniform(0.0, 1.0)),
    )
    return params, rng


# ---------------------------------------------------------------------------
# Texture synthesis
# ---------------------------------------------------------------------------


def smooth_noise(
    rng: np.random.Generator, shape: tuple[int, int], sigma_y: float, sigma_x: float
) -> np.ndarray:
    """Zero-mean, unit-variance band-limited noise.

    Blurring white Gaussian noise is the cheap stand-in for Perlin here. Wrap
    mode keeps the blur from darkening the borders, and the explicit
    re-normalisation matters: filtered noise is not unit-variance, and a
    biased warp field would drag every texture the same way.
    """
    field = gaussian_filter(
        rng.standard_normal(shape),
        sigma=(max(sigma_y, 0.4), max(sigma_x, 0.4)),
        mode="wrap",
    )
    field -= field.mean()
    deviation = field.std()
    return field / deviation if deviation > 1e-9 else field


def fbm(
    rng: np.random.Generator,
    shape: tuple[int, int],
    sigma: float,
    octaves: int,
    lacunarity: float,
    gain: float,
    anisotropy: float,
) -> np.ndarray:
    """Fractal sum of smoothed noise: broad shapes with fine detail on top."""
    total = np.zeros(shape)
    amplitude, scale = 1.0, sigma
    for _ in range(octaves):
        total += amplitude * smooth_noise(
            rng, shape, scale * anisotropy, scale / anisotropy
        )
        amplitude *= gain
        scale /= lacunarity
        # Octaves finer than a few pixels turn the contour bands into dust
        # rather than detail, so the sum stops before it gets there.
        if scale < 3.0:
            break
    total -= total.mean()
    deviation = total.std()
    return total / deviation if deviation > 1e-9 else total


def smoothstep(edge0: float, edge1: float, values: np.ndarray) -> np.ndarray:
    t = np.clip((values - edge0) / max(edge1 - edge0, 1e-6), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def render(
    params: TextureParams,
    rng: np.random.Generator,
    width: int,
    height: int,
    stages: dict[str, np.ndarray] | None = None,
) -> np.ndarray:
    """Synthesise one texture. Returns a boolean ink mask, True where white.

    Pass a dict as ``stages`` to collect the intermediate fields under the
    names of the numbered steps below, for documenting the pipeline.
    """
    shape = (height, width)
    y, x = np.mgrid[0:height, 0:width].astype(float)
    scale = min(width, height) / REFERENCE_WIDTH  # keeps the look size-independent

    # 1. Base field.
    base = fbm(
        rng,
        shape,
        params.base_sigma * scale,
        params.octaves,
        params.lacunarity,
        params.gain,
        params.anisotropy,
    )

    # 2. Domain warping -- displace the sample coordinates by a second field.
    strength = params.warp_strength * scale
    warp_sigma = params.warp_sigma * scale
    offset_y = fbm(rng, shape, warp_sigma, 2, 2.0, 0.5, params.anisotropy) * strength
    offset_x = fbm(rng, shape, warp_sigma, 2, 2.0, 0.5, params.anisotropy) * strength
    coordinates = np.array(
        [
            np.clip(y + offset_y, 0, height - 1).ravel(),
            np.clip(x + offset_x, 0, width - 1).ravel(),
        ]
    )
    if stages is not None:
        stages["base"] = base
    warped = map_coordinates(base, coordinates, order=1, mode="reflect").reshape(shape)
    warped -= warped.mean()
    deviation = warped.std()
    if deviation > 1e-9:
        warped /= deviation

    # 3. Contour banding. The directional term turns concentric topography into
    #    grain; grit breaks the strokes so they read as engraved, not printed.
    grain = (
        (x - width / 2) * math.cos(params.stripe_angle)
        + (y - height / 2) * math.sin(params.stripe_angle)
    ) / max(width, height)
    grit = smooth_noise(rng, shape, 3.2 * scale, 3.2 * scale) * params.grit

    phase = (
        warped * params.contour_freq
        + grain * params.stripe_freq * params.stripe_weight
        + grit
        + params.phase
    )
    ridged = np.sin(phase * 2.0 * math.pi)
    if stages is not None:
        stages["warped"] = warped
        stages["bands"] = ridged

    # 4. Blob mask: an irregular radial falloff, so the texture sits as a
    #    splotch on black rather than filling the frame.
    distance = np.sqrt(
        ((x - width / 2) / (width * 0.5)) ** 2 + ((y - height / 2) / (height * 0.5)) ** 2
    )
    distance = distance + params.blob_irregularity * fbm(
        rng, shape, 34.0 * scale, 2, 2.0, 0.5, 1.0
    )
    mask = 1.0 - smoothstep(params.blob_inner, params.blob_outer, distance)
    if stages is not None:
        stages["mask"] = mask * 2.0 - 1.0

    # 5. Threshold to pure black and white. Cutting the sine at a fixed value
    #    leaves solid plateaus wherever the warped field is locally flat, so
    #    the cut is made on the distance to the nearest contour instead --
    #    |s| / |grad s|, a first-order estimate in pixels. Every stroke then
    #    carries the same weight regardless of how steep the terrain under it
    #    is, which is what reads as engraving rather than as blown-out ink.
    gradient_y, gradient_x = np.gradient(ridged)
    steepness = np.maximum(np.hypot(gradient_y, gradient_x), 1e-6)
    to_line = np.abs(ridged) / steepness

    # Strokes are heaviest in the core and taper to nothing at the rim.
    stroke = params.line_width * scale
    ink = to_line < stroke * mask * (0.55 + 0.75 * mask)

    # A faint outer field: sparse wisps of the same structure beyond the blob,
    # which is what stops the frame reading as an empty black box.
    if params.halo > 0.01:
        rim = (1.0 - mask) * (
            1.0 - smoothstep(params.blob_outer, params.blob_outer + 0.55, distance)
        )
        ink |= to_line < stroke * params.halo * rim * rim * 0.35

    if stages is not None:
        stages["ink"] = np.where(ink, 1.0, -1.0)

    return ink


def encode(ink: np.ndarray, bit_depth: int) -> Image.Image:
    if bit_depth == 1:
        return Image.fromarray(ink).convert("1", dither=Image.Dither.NONE)
    return Image.fromarray(np.where(ink, 255, 0).astype(np.uint8), mode="L")


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------


def generate_one(job: tuple[str, str, int, int, str, int]) -> tuple[str, int]:
    article_id, theme, width, height, out_path, bit_depth = job
    params, rng = instance_params(theme, article_id)
    image = encode(render(params, rng, width, height), bit_depth)
    image.save(out_path, optimize=True)
    return article_id, Path(out_path).stat().st_size


def build_contact_sheet(paths: list[Path], destination: Path, columns: int = 12) -> None:
    """A grid of every thumbnail, for eyeballing how the themes cluster."""
    thumbs = [Image.open(p).convert("L").resize((112, 138)) for p in paths]
    rows = math.ceil(len(thumbs) / columns)
    sheet = Image.new("L", (columns * 116 + 4, rows * 142 + 4), color=40)
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, (4 + (index % columns) * 116, 4 + (index // columns) * 142))
    sheet.save(destination)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--articles", type=Path, default=ARTICLES_TS)
    parser.add_argument("--out", type=Path, default=OUT_DIR)
    parser.add_argument("--clusters", type=int, default=14, help="number of research themes")
    parser.add_argument("--seed", type=int, default=20260910, help="clustering seed")
    parser.add_argument("--size", default="324x352", help="WxH, e.g. 324x352")
    parser.add_argument("--bit-depth", type=int, choices=(1, 8), default=1)
    parser.add_argument("--limit", type=int, default=0, help="only the first N articles")
    parser.add_argument("--only", default="", help="only ids containing this substring")
    parser.add_argument("--jobs", type=int, default=0, help="worker processes (0 = cpu count)")
    parser.add_argument("--report", action="store_true", help="print the themes and exit")
    parser.add_argument("--contact-sheet", type=Path, default=None)
    args = parser.parse_args(argv)

    width, height = (int(value) for value in args.size.lower().split("x"))

    articles = load_articles(args.articles)
    themes, theme_names = assign_themes(articles, args.clusters, args.seed)

    if args.report:
        by_theme: dict[str, list[str]] = {name: [] for name in theme_names}
        for article, theme in zip(articles, themes):
            by_theme[theme].append(article["title"])
        for name in sorted(by_theme, key=lambda n: -len(by_theme[n])):
            titles = by_theme[name]
            print("\n{}  ({} articles)".format(name, len(titles)))
            for title in titles[:6]:
                print("    - {}".format(title[:96]))
            if len(titles) > 6:
                print("    ... and {} more".format(len(titles) - 6))
        return 0

    selected = [
        (article, theme)
        for article, theme in zip(articles, themes)
        if not args.only or args.only in article["id"]
    ]
    if args.limit:
        selected = selected[: args.limit]

    args.out.mkdir(parents=True, exist_ok=True)

    jobs = [
        (
            article["id"],
            theme,
            width,
            height,
            str(args.out / "{}.png".format(article["id"])),
            args.bit_depth,
        )
        for article, theme in selected
    ]

    total_bytes = 0
    with concurrent.futures.ProcessPoolExecutor(max_workers=args.jobs or None) as pool:
        for done, (article_id, size) in enumerate(pool.map(generate_one, jobs), start=1):
            total_bytes += size
            print(
                "  [{:>3}/{}] {:<60} {:6.1f} KB".format(
                    done, len(jobs), article_id[:60], size / 1024
                )
            )

    manifest = {
        "generatedBy": "scripts/generate_node_thumbnails.py",
        "size": {"width": width, "height": height},
        "clusters": args.clusters,
        "seed": args.seed,
        "themes": {article["id"]: theme for article, theme in selected},
    }
    (args.out / "manifest.json").write_text(
        json.dumps(manifest, indent="\t") + "\n", encoding="utf-8"
    )

    print(
        "\n{} thumbnails, {:.1f} MB total -> {}".format(
            len(jobs), total_bytes / 1024 / 1024, args.out
        )
    )

    if args.contact_sheet:
        build_contact_sheet([Path(job[4]) for job in jobs], args.contact_sheet)
        print("contact sheet -> {}".format(args.contact_sheet))

    return 0


if __name__ == "__main__":
    sys.exit(main())
