import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// Conversation memory is entirely client-side. The backend is stateless, so
// only the recent transcript is worth sending — and sending more just inflates
// the prompt. One turn is a user message plus the AI reply.
const MAX_TURNS = 3;

// ---------------------------------------------------------------------------
// DEMO ONLY — REMOVE BEFORE THIS REPO GOES PUBLIC OR THE BACKEND STAYS UP
// ---------------------------------------------------------------------------
// Hardcoded so the demo runs without any environment configuration. This file
// is a SvelteKit server route, so these values are never sent to the browser —
// the exposure is anyone who can read this repository.
// Environment variables still win when set, so deleting these two constants
// (and the `??` fallbacks below) restores normal config-driven behaviour.
const DEMO_BACKEND_URL = 'https://api-rag-demo.happybay-96c5cfb7.norwayeast.azurecontainerapps.io';
const DEMO_BACKEND_API_KEY = '-LcUoqsm8tpcQtCYztFiKbOp4FTNgXDQSZ0dBPDxxuQ';
// ---------------------------------------------------------------------------

interface ChatMessage {
	role: string;
	content: string;
}

/**
 * Resolve the backend origin from config, falling back to the demo backend when
 * the configured value cannot possibly work.
 *
 * A misconfigured PRIVATE_BACKEND_URL used to fail in a way that pointed
 * diagnosis in completely the wrong direction: if it named this site's own
 * origin, the route proxied to itself, the homepage answered POST with 405, and
 * that 405 was passed straight back to the browser — which reads as "POST isn't
 * allowed on /chat", i.e. a routing bug, rather than a bad environment variable.
 * Catching it here keeps the misconfiguration visible in the function logs
 * instead of disguising it as a broken endpoint.
 */
function resolveBackendUrl(raw: string | undefined, selfOrigin: string): string {
	const candidate = raw?.trim();
	if (!candidate) return DEMO_BACKEND_URL;

	let parsed: URL;
	try {
		parsed = new URL(candidate);
	} catch {
		console.error(
			`PRIVATE_BACKEND_URL is not an absolute URL (${candidate}); falling back to the demo backend`
		);
		return DEMO_BACKEND_URL;
	}

	if (parsed.origin === selfOrigin) {
		console.error(
			`PRIVATE_BACKEND_URL points back at this site (${parsed.origin}); falling back to the demo backend`
		);
		return DEMO_BACKEND_URL;
	}

	// Tolerate a trailing slash so the caller can append the path segment.
	return (parsed.origin + parsed.pathname).replace(/\/+$/, '');
}

export const POST: RequestHandler = async ({ request, url }) => {
	const PRIVATE_BACKEND_URL = resolveBackendUrl(env.PRIVATE_BACKEND_URL, url.origin);
	const BACKEND_API_KEY = env.BACKEND_API_KEY || DEMO_BACKEND_API_KEY;

	const { messages } = (await request.json()) as { messages: ChatMessage[] };

	// Drop the UI-only fields (researchers, researcherInfo, isError) — the
	// backend rejects unexpected shapes and they are dead weight in the payload.
	const recent = (messages ?? [])
		.slice(-MAX_TURNS * 2)
		.map(({ role, content }) => ({ role, content }));

	if (recent.length === 0) {
		return json({ error: true }, { status: 400 });
	}

	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	// Added server-side so the shared secret never reaches the browser.
	if (BACKEND_API_KEY) headers['X-API-Key'] = BACKEND_API_KEY;

	try {
		// The graph makes several sequential LLM calls, so a cold request can run
		// well past the default fetch timeout on some platforms.
		const backendResponse = await fetch(`${PRIVATE_BACKEND_URL}/`, {
			method: 'POST',
			body: JSON.stringify({ messages: recent }),
			headers,
			signal: AbortSignal.timeout(120_000)
		});

		if (!backendResponse.ok) {
			// Deliberately not mirroring the upstream status: this route being
			// reachable and the backend being healthy are separate facts, and
			// forwarding e.g. a 405 from upstream makes /chat itself look broken.
			// 502 says what actually happened — the gateway hop failed.
			console.error(
				`backend ${PRIVATE_BACKEND_URL} returned ${backendResponse.status} ${backendResponse.statusText}`
			);
			return json({ error: true }, { status: 502 });
		}

		return json(await backendResponse.json());
	} catch (err) {
		console.error('error communicating with backend:', err);
		return json({ error: true }, { status: 502 });
	}
};
