/**
 * Lazy access to the article abstracts.
 *
 * Every article carries three readings of the same abstract — the scientist
 * one (the paper's own, where it had one), plus student and layman rewrites
 * generated alongside it. Together they are around a megabyte, which is far
 * too much to bundle into a homepage that may never open a single article, so
 * they ship as a static JSON file and are fetched once on first use.
 */

import { browser } from '$app/environment';

export const CONTENT_MODES = ['scientist', 'student', 'layman'] as const;

export type ContentMode = (typeof CONTENT_MODES)[number];

export type ArticleAbstracts = Record<ContentMode, string>;

export const CONTENT_MODE_LABELS: Record<ContentMode, string> = {
	scientist: 'Scientist',
	student: 'Student',
	layman: 'Layman'
};

let cache: Record<string, ArticleAbstracts> | null = null;
let inFlight: Promise<Record<string, ArticleAbstracts>> | null = null;

/**
 * Fetch the abstracts once and hold them for the life of the page.
 *
 * A failure resolves to an empty map rather than throwing: an article whose
 * abstract will not load should degrade to its teaser, not break the node
 * field around it.
 */
export function loadAbstracts(): Promise<Record<string, ArticleAbstracts>> {
	if (cache) return Promise.resolve(cache);
	if (!browser) return Promise.resolve({});

	inFlight ??= fetch('/articles/abstracts.json')
		.then((response) => {
			if (!response.ok) throw new Error(`abstracts.json returned ${response.status}`);
			return response.json() as Promise<Record<string, ArticleAbstracts>>;
		})
		.then((data) => {
			cache = data;
			return data;
		})
		.catch((err) => {
			console.error('Could not load article abstracts:', err);
			inFlight = null;
			return {};
		});

	return inFlight;
}

/** Whatever is already in memory. Null until `loadAbstracts` has resolved. */
export function peekAbstracts(): Record<string, ArticleAbstracts> | null {
	return cache;
}

export function abstractFor(
	id: string,
	mode: ContentMode,
	fallback = ''
): string {
	const entry = cache?.[id];
	if (!entry) return fallback;
	// Student and layman are written from the scientist text, so a missing one
	// falls back through to it rather than leaving the panel blank.
	return entry[mode] || entry.scientist || fallback;
}
