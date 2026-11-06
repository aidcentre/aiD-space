import type { PageServerLoad } from './$types';
import { allEventsQuery, eventsPageQuery } from '$lib/sanity/queries';
import type { AidEvent, EventsDocument } from '$lib/sanity/types';

export const load: PageServerLoad = async ({ locals }) => {
	const { sanity } = locals;
	const [{ data: events }, { data: allEvents }] = await Promise.all([
		sanity.loadQuery<EventsDocument | null>(eventsPageQuery, {}),
		sanity.loadQuery<AidEvent[]>(allEventsQuery, {})
	]);
	return { events, allEvents };
};
