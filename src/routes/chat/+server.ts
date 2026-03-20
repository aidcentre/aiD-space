import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { q } = await request.json();
	console.log('4. query successfully sent to endpoint!', q);
	const llmResponse = 'concat test!!! :) ' + q;

	return json(llmResponse);
}
