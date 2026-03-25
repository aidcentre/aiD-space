import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	// 302 used since it's a fallback redirect, not permanent redirect
	if (response.status === 404) throw redirect(302, '/');
	return response;
};
