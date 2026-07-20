import type { AidEvent } from '$lib/sanity/types';

/** Full event location as a single line, e.g. "Venue, City, Country" or "Online". */
export function buildCalendarLocation(event: Pick<AidEvent, 'isOnline' | 'location'>): string {
	if (event.isOnline) return 'Online';
	const parts = [event.location?.venue, event.location?.city, event.location?.country].filter(Boolean);
	return parts.join(', ');
}

/** Formats an ISO datetime as a UTC calendar timestamp: YYYYMMDDTHHMMSSZ. */
function toUtcStamp(date: Date): string {
	return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/** Escapes text for use in an .ics field value. */
function escapeIcsText(text: string): string {
	return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

type CalendarEvent = Pick<
	AidEvent,
	'title' | 'excerpt' | 'startDate' | 'endDate' | 'isOnline' | 'location' | 'registrationUrl'
>;

function resolveTimes(event: CalendarEvent) {
	const start = event.startDate ? new Date(event.startDate) : null;
	if (!start) return null;
	const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000);
	return { start, end };
}

/** Builds a Google Calendar "render" event-creation URL. */
export function buildGoogleCalendarUrl(event: CalendarEvent): string | null {
	const times = resolveTimes(event);
	if (!times) return null;

	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: event.title ?? 'Event',
		dates: `${toUtcStamp(times.start)}/${toUtcStamp(times.end)}`,
		details: event.excerpt ?? '',
		location: buildCalendarLocation(event)
	});

	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Builds an Outlook Web (outlook.office.com/live calendar) event-creation URL. */
export function buildOutlookCalendarUrl(event: CalendarEvent): string | null {
	const times = resolveTimes(event);
	if (!times) return null;

	const params = new URLSearchParams({
		path: '/calendar/action/compose',
		rru: 'addevent',
		subject: event.title ?? 'Event',
		startdt: times.start.toISOString(),
		enddt: times.end.toISOString(),
		body: event.excerpt ?? '',
		location: buildCalendarLocation(event)
	});

	return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** Builds .ics file content for the event, suitable for download. */
export function buildIcsContent(event: CalendarEvent): string | null {
	const times = resolveTimes(event);
	if (!times) return null;

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Aidspace//Events//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'BEGIN:VEVENT',
		`UID:${crypto.randomUUID()}`,
		`DTSTAMP:${toUtcStamp(new Date())}`,
		`DTSTART:${toUtcStamp(times.start)}`,
		`DTEND:${toUtcStamp(times.end)}`,
		`SUMMARY:${escapeIcsText(event.title ?? 'Event')}`
	];

	const description = [event.excerpt, event.registrationUrl].filter(Boolean).join('\\n\\n');
	if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`);

	const location = buildCalendarLocation(event);
	if (location) lines.push(`LOCATION:${escapeIcsText(location)}`);

	lines.push('END:VEVENT', 'END:VCALENDAR');
	return lines.join('\r\n');
}

export function isMobileDevice(): boolean {
	if (typeof navigator === 'undefined') return false;
	return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Downloads an .ics file for the event — double-clicking it opens the OS's default calendar app (Mac Calendar, Outlook desktop, etc). */
export function downloadIcsFile(event: CalendarEvent) {
	const content = buildIcsContent(event);
	if (!content) return;

	const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${(event.title ?? 'event').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function openGoogleCalendar(event: CalendarEvent) {
	const url = buildGoogleCalendarUrl(event);
	if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

export function openOutlookCalendar(event: CalendarEvent) {
	const url = buildOutlookCalendarUrl(event);
	if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Adds the event to the user's calendar: downloads an .ics file on mobile
 * (opens the device's default calendar app), opens Google Calendar in a new
 * tab on desktop. Used as the default action; desktop users can otherwise
 * pick a specific provider from the Add to Calendar menu.
 */
export function addEventToCalendar(event: CalendarEvent) {
	if (isMobileDevice()) {
		downloadIcsFile(event);
		return;
	}

	openGoogleCalendar(event);
}
