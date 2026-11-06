/**
 * Lazy access to each article's relevant articles.
 *
 * The lists are worked out offline by scripts/build_related_articles.py, from
 * the embeddings the expertise search already keeps for every paper, and ship
 * as static/articles/related.json. Like the abstracts, they are fetched once
 * on first use rather than bundled: most visits never open an article.
 */

import { browser } from '$app/environment';
import { articleById, CORPUS_FINGERPRINT, type Article } from './articles';

export type RelatedArticle = {
	article: Article;
	/** Cosine similarity of the two papers' embeddings, 0-1. */
	score: number;
};

type RelatedLists = Record<string, [id: string, score: number][]>;

type RelatedFile = {
	/** CORPUS_FINGERPRINT of the articles the lists were built from. */
	fingerprint: string;
	related: RelatedLists;
};

let cache: RelatedLists | null = null;
let inFlight: Promise<RelatedLists> | null = null;

/**
 * Fetch the lists once and hold them for the life of the page.
 *
 * A failure resolves to an empty map rather than throwing: without the lists
 * the panel just ends at the researcher card.
 */
export function loadRelated(): Promise<RelatedLists> {
	if (cache) return Promise.resolve(cache);
	if (!browser) return Promise.resolve({});

	inFlight ??= fetch('/articles/related.json')
		.then((response) => {
			if (!response.ok) throw new Error(`related.json returned ${response.status}`);
			return response.json() as Promise<RelatedFile>;
		})
		.then((file) => {
			// Still usable, since ids are content-derived: anything added since
			// just goes without suggestions until the script is re-run.
			if (file.fingerprint !== CORPUS_FINGERPRINT) {
				console.warn(
					'related.json was built from a different corpus; re-run scripts/build_related_articles.py'
				);
			}
			cache = file.related;
			return cache;
		})
		.catch((err) => {
			console.error('Could not load related articles:', err);
			inFlight = null;
			return {};
		});

	return inFlight;
}

/** Up to three relevant articles, most relevant first. Empty until loaded. */
export function relatedFor(id: string): RelatedArticle[] {
	const related: RelatedArticle[] = [];
	for (const [relatedId, score] of cache?.[id] ?? []) {
		const article = articleById(relatedId);
		if (article) related.push({ article, score });
	}
	return related;
}
