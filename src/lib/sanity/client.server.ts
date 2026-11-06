import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { client } from './client';

const token = env.SANITY_API_READ_TOKEN;

/**
 * Server-only client: token when present (drafts / preview), CDN off, stega for visual editing.
 *
 * In local dev, reads the `drafts` perspective so unpublished edits made in a local Sanity Studio
 * show up immediately on refresh — requires `token` (a Viewer token is enough). Production always
 * reads `published` only, regardless of this flag.
 */
export const serverClient = client.withConfig({
	...(token ? { token } : {}),
	...(dev && token ? { perspective: 'drafts' } : {}),
	useCdn: false,
	stega: true
});
