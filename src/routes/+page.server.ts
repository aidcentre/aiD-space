import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const userQuery = data.get('userQuery');
		console.log("1. this was the user's query, directly after form submission", userQuery);
		redirect(303, `/chat?q=${userQuery}`);
	}
} satisfies Actions;
