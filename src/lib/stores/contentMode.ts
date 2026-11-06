import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { CONTENT_MODES, type ContentMode } from '$lib/data/abstracts';

const STORAGE_KEY = 'aid:content-mode';

function initial(): ContentMode {
	if (!browser) return 'scientist';
	const stored = localStorage.getItem(STORAGE_KEY);
	return CONTENT_MODES.includes(stored as ContentMode) ? (stored as ContentMode) : 'scientist';
}

/**
 * Which reading of an abstract the site is showing.
 *
 * Shared rather than local to the detail panel: the search results render
 * abstracts too, and it would be odd for the panel to say Layman while the
 * cards behind it stayed technical. Persisted so the choice survives a reload.
 */
export const contentMode = writable<ContentMode>(initial());

if (browser) {
	contentMode.subscribe((mode) => localStorage.setItem(STORAGE_KEY, mode));
}
