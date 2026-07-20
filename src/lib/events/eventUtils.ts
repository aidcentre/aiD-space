import type { AidEvent } from '$lib/sanity/types';
import { formatDate } from '$lib/utils';

/** "June 3, 2026" or "June 3, 2026 – June 5, 2026" (same-day ranges collapse). */
export function formatEventDates(event: Pick<AidEvent, 'startDate' | 'endDate'>): string {
	if (!event.startDate) return '';
	const start = formatDate(event.startDate);
	if (!event.endDate) return start;
	const end = formatDate(event.endDate);
	return end === start ? start : `${start} – ${end}`;
}

/** "Sep 3, 2026" or "Sep 1, 2026 – Sep 3, 2026" (same-day ranges collapse). */
export function formatEventDatesShort(event: Pick<AidEvent, 'startDate' | 'endDate'>): string {
	if (!event.startDate) return '';
	const format = (date: string) =>
		new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const start = format(event.startDate);
	if (!event.endDate) return start;
	const end = format(event.endDate);
	return end === start ? start : `${start} – ${end}`;
}

/** "Online" or "Venue, City" depending on the event. */
export function formatEventLocation(
	event: Pick<AidEvent, 'isOnline' | 'location'>
): string {
	if (event.isOnline) return 'Online';
	const parts = [event.location?.venue, event.location?.city].filter(Boolean);
	return parts.join(', ');
}

export function formatEventType(eventType?: string): string {
	return eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : '';
}
