import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Conversation memory is entirely client-side. The backend is stateless, so
// only the recent transcript is worth sending — and sending more just inflates
// the prompt. One turn is a user message plus the AI reply.
const MAX_TURNS = 3;

// Hard cap on a single user message. Enforced here as well as in the search
// bar so an oversized query never reaches the backend or the LLM, whatever
// posted it. The FastAPI app applies the same limit again.
const MAX_QUERY_CHARS = 120;

// Server-side only — both come from the host's environment (the Static Web App
// settings in production, .env locally) and never reach the browser.
const BACKEND_URL = env.PRIVATE_BACKEND_URL;
const BACKEND_API_KEY = env.BACKEND_API_KEY;

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

	if (recent.some((m) => m.role === 'user' && m.content.trim().length > MAX_QUERY_CHARS)) {
		return json(
			{ error: true, message: `queries are limited to ${MAX_QUERY_CHARS} characters` },
			{ status: 400 }
		);
	}

	if (!BACKEND_URL) {
		console.error('PRIVATE_BACKEND_URL is not set');
		return json({ error: true }, { status: 502 });
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
