import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { userQuery } = await request.json();
	const llmResponse = 'concat test ' + userQuery;

	return json(llmResponse);
}
