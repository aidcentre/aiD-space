"""
Turning Cosmos hybrid-search hits into ranked documents and ranked researchers.

Replaces the old in-memory pipeline (pandas cosine sweep + local bm25s index).
Cosmos now does the ranking; this module only aggregates chunk-level hits up to
document level and then to researcher level.
"""

from dataclasses import dataclass, field
from typing import Any

from aid_expertise_search import azure_store
from aid_expertise_search.config import settings


@dataclass
class RankedDocument:
    doc_id: str
    name: str
    title: str
    score: float
    similarity: float
    # Best-matching chunk texts, most relevant first.
    snippets: list[str] = field(default_factory=list)


@dataclass
class SearchResult:
    documents: list[RankedDocument]
    researcher_scores: dict[str, float]
    top_similarity: float

    @property
    def is_empty(self) -> bool:
        return not self.documents


def _aggregate_to_documents(
    hybrid_hits: list[dict[str, Any]],
    similarity_by_doc: dict[str, float],
) -> list[RankedDocument]:
    """
    Collapse chunk hits to documents.

    A document's score is the sum of its chunks' RRF scores, which rewards a
    document that matches the query in several places. Its similarity is the
    max over its chunks, matching the old `max_cosine_for_document`.
    """
    by_doc: dict[str, RankedDocument] = {}
    for hit in hybrid_hits:
        doc_id = hit["doc_id"]
        doc = by_doc.get(doc_id)
        if doc is None:
            doc = RankedDocument(
                doc_id=doc_id,
                name=hit.get("name", ""),
                title=hit.get("title", ""),
                score=0.0,
                similarity=similarity_by_doc.get(doc_id, 0.0),
            )
            by_doc[doc_id] = doc
        doc.score += hit["rrf_score"]
        if len(doc.snippets) < 3:
            doc.snippets.append(hit.get("text", ""))

    return sorted(by_doc.values(), key=lambda d: d.score, reverse=True)


def score_researchers(
    documents: list[RankedDocument], square: bool = True, gamma: float = 0.2
) -> dict[str, float]:
    """
    Score researchers from their documents' scores.

    This is the original `gather_relevance_score` formula, unchanged: sum each
    researcher's document scores (squared, to reward one strong match over
    several weak ones), then damp by publication count so that prolific
    researchers do not dominate every query.
    """
    article_score: dict[str, float] = {}
    n_papers: dict[str, int] = {}

    for doc in documents:
        n_papers[doc.name] = n_papers.get(doc.name, 0) + 1
        contribution = (1 + doc.score) ** 2 - 1 if square else doc.score
        article_score[doc.name] = article_score.get(doc.name, 0.0) + contribution

    if not n_papers:
        return {}

    max_n_papers = max(n_papers.values())
    return {
        name: 100 * article_score[name] / (n_papers[name] * max_n_papers) ** gamma
        for name in article_score
    }


def search(
    query: str, vector: list[float], gate_vector: list[float] | None = None
) -> SearchResult:
    """
    Run the hybrid search and rank both documents and researchers.

    `vector`/`query` drive retrieval. `gate_vector` decides whether the corpus
    can answer at all, and should be the embedding of the user's *own* words.

    That split matters. The graph rewrites a question into a scientific field
    before searching, and the rewriter always produces a plausible-sounding
    field — "recipe for chocolate cake" becomes "Food science (baking
    chemistry)", which scores 0.449 against a research corpus where the raw
    question scores 0.222. Gating on the rewrite therefore admits nonsense and
    penalises genuine questions, whose raw form scores higher than their
    academic paraphrase. The user's own words are the honest signal.
    """
    top_k = settings.retrieval_top_k

    # Gate first, on the cheapest possible query, so rejected questions never
    # pay for the full retrieval.
    gate_hits = azure_store.vector_search(gate_vector or vector, 1)
    top_similarity = max(
        (float(hit.get("similarity", 0.0)) for hit in gate_hits), default=0.0
    )
    if top_similarity < settings.min_similarity:
        return SearchResult(documents=[], researcher_scores={}, top_similarity=top_similarity)

    similarity_hits = azure_store.vector_search(vector, top_k)
    similarity_by_doc: dict[str, float] = {}
    for hit in similarity_hits:
        doc_id = hit["doc_id"]
        similarity = float(hit.get("similarity", 0.0))
        if similarity > similarity_by_doc.get(doc_id, -1.0):
            similarity_by_doc[doc_id] = similarity

    hybrid_hits = azure_store.hybrid_search(vector, query, top_k)
    documents = _aggregate_to_documents(hybrid_hits, similarity_by_doc)

    return SearchResult(
        documents=documents,
        researcher_scores=score_researchers(documents),
        top_similarity=top_similarity,
    )


def top_researchers(
    researcher_scores: dict[str, float], limit: int = 5
) -> list[tuple[str, float]]:
    """The `limit` highest-scoring researchers, highest first."""
    return sorted(researcher_scores.items(), key=lambda pair: pair[1], reverse=True)[:limit]


def documents_for_researchers(names: list[str]) -> list[RankedDocument]:
    """Every indexed document by the named researchers, for direct-lookup queries."""
    return [
        RankedDocument(
            doc_id=item["doc_id"],
            name=item["name"],
            title=item.get("title", ""),
            score=1.0,
            similarity=1.0,
            snippets=[item.get("preview", "")],
        )
        for item in azure_store.documents_by_researchers(names)
    ]
