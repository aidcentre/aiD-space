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

export const POST: RequestHandler = async ({ request }) => {
	const PRIVATE_BACKEND_URL = env.PRIVATE_BACKEND_URL || DEMO_BACKEND_URL;
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
			console.error('backend returned error status:', backendResponse.status);
			return json({ error: true }, { status: backendResponse.status });
		}

		return json(await backendResponse.json());
	} catch (err) {
		console.error('error communicating with backend:', err);
		return json({ error: true }, { status: 502 });
	}
};
