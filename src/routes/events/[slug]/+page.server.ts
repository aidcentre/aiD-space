import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eventBySlugQuery } from '$lib/sanity/queries';
import type { AidEvent } from '$lib/sanity/types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { sanity } = locals;
	const { data: event } = await sanity.loadQuery<AidEvent | null>(eventBySlugQuery, {
		slug: params.slug
	});

	if (!event) {
		error(404, 'Event not found');
	}

	return { event };
};
