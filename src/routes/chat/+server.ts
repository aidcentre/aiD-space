import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { messages } = await request.json();
	console.log('4. query successfully sent to +server.ts: ', messages);

	try {
		const backendResponse = await fetch(`/`, {
			method: 'POST',
			body: JSON.stringify({ messages }),
			headers: { 'Content-Type': 'application/json' }
		});
		const data = await backendResponse.json();
		return json(data);
	} catch (err) {
		console.error('error communicating with backend:', err);
		throw err;
	}
}
