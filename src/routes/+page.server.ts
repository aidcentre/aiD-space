import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

// this form action is automatically linked to the / directory as a built-in SvelteKit feature:
// +page.server.js files can export actions, which allow you to POST data to the server using the <form> element (the one in SearchBar.svelte)
// for more details on form actions check the SvelteKit documentation
// https://svelte.dev/docs/kit/form-actions
export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const userQuery = data.get('userQuery');
		console.log("1. this was the user's query, directly after form submission", userQuery);
		redirect(303, `/chat?q=${userQuery}`);
	}
} satisfies Actions;
