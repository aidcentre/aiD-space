import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
const { PRIVATE_BACKEND_URL } = env;

export async function POST({ request }) {
	const { messages } = await request.json();
	console.log('4. query successfully sent to +server.ts: ', messages);

	try {
		const backendResponse = await fetch(`${PRIVATE_BACKEND_URL}/`, {
			method: 'POST',
			body: JSON.stringify({ messages }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (!backendResponse.ok) {
			console.error('backend returned error status:', backendResponse.status);
			return json({ error: true }, { status: backendResponse.status });
		}
		const data = await backendResponse.json();
		return json(data);
	} catch (err) {
		console.error('error communicating with backend:', err);
		return json({ error: true }, { status: 502 });
	}
}
