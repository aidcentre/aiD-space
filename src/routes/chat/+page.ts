import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	let q = url.searchParams.get('q');
	console.log('2. +page in chat to transfer the query to the +page ', q);
	return { query: q };
};
