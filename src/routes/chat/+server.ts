import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Conversation memory is entirely client-side. The backend is stateless, so
// only the recent transcript is worth sending — and sending more just inflates
// the prompt. One turn is a user message plus the AI reply.
const MAX_TURNS = 3;

// ---------------------------------------------------------------------------
// DEMO ONLY — REMOVE BEFORE THIS REPO GOES PUBLIC OR THE BACKEND STAYS UP
// ---------------------------------------------------------------------------
// Deliberately hardcoded, and deliberately NOT read from the environment.
//
// The deployed BACKEND_URL kept pointing somewhere unreachable — first
// at this site's own origin (405), then at an address that refused the
// connection outright (502) — and every search on the live site failed as a
// result. Reading these from the environment is the correct long-term design,
// but until the hosting config is fixed the environment is the thing that is
// broken, so it is bypassed entirely here.
//
// This file is a SvelteKit server route, so these values are never sent to the
// browser. The exposure is anyone who can read this repository. Restoring
// config-driven behaviour means reading $env/dynamic/private again and setting
// BACKEND_URL / BACKEND_API_KEY on the host.
const BACKEND_URL = 'https://api-rag-demo.happybay-96c5cfb7.norwayeast.azurecontainerapps.io';
const BACKEND_API_KEY = '-LcUoqsm8tpcQtCYztFiKbOp4FTNgXDQSZ0dBPDxxuQ';
// ---------------------------------------------------------------------------

interface ChatMessage {
	role: string;
	content: string;
}

export const POST: RequestHandler = async ({ request }) => {
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
		const backendResponse = await fetch(`${BACKEND_URL}/`, {
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
				`backend ${BACKEND_URL} returned ${backendResponse.status} ${backendResponse.statusText}`
			);
			return json({ error: true }, { status: 502 });
		}

		return json(await backendResponse.json());
	} catch (err) {
		console.error('error communicating with backend:', err);
		return json({ error: true }, { status: 502 });
	}
};
