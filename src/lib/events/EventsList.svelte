<script lang="ts">
	import type { AidEvent } from '$lib/sanity/types';
	import EventCard from './EventCard.svelte';

	let {
		events = [],
		showPast = false,
		onTogglePast
	}: { events?: AidEvent[]; showPast?: boolean; onTogglePast?: () => void } = $props();

	const byStartDate = (a: AidEvent, b: AidEvent) =>
		new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime();

	/** Featured events are pulled out and shown on their own, so the list below excludes them. */
	const featured = $derived(events.filter((event) => event.featured).sort(byStartDate));
	const rest = $derived(events.filter((event) => !event.featured).sort(byStartDate));
</script>

<!-- `.events-fade` elements are faded out and back in by the page when the past-events toggle flips.
     The `{#key events}` blocks remount every card when the filtered list changes, so all titles
     scramble in again rather than only the newly added ones. -->
{#key events}
{#if featured.length}
	<div class="events-fade flex flex-col gap-3 rounded-xl border border-dashed border-off-black p-4 md:p-5 lg:p-6 mb-12">
		<div class="font-family-mono text-xs md:text-sm text-off-black">Featured events</div>
		{#each featured as event (event._id)}
			<EventCard {event} />
		{/each}
	</div>
{/if}
{/key}

<div class="flex items-center justify-between gap-4 mb-4">
	<div class="events-fade font-family-mono text-xs md:text-sm text-off-black">
		{featured.length ? 'More Events' : 'All Events'}
	</div>
	<button
		type="button"
		role="switch"
		aria-checked={showPast}
		class="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-family-mono text-xs md:text-sm whitespace-nowrap transition-colors duration-200 {showPast
			? 'text-off-black'
			: 'text-grey'}"
		onclick={() => onTogglePast?.()}
	>
		<div
			class="aspect-square size-3.25 rounded {showPast ? 'bg-off-black' : 'border-grey border-2'}"
		></div>
		Show Past Events
	</button>
</div>

<div class="events-fade">
	{#key events}
	{#if rest.length}
		<div class="flex flex-col gap-3">
			{#each rest as event (event._id)}
				<EventCard {event} />
			{/each}
		</div>
	{:else}
		<div class="flex flex-col rounded-xl bg-white p-4 md:p-5 lg:p-6">
			<div class="font-family-mono text-xs md:text-sm text-off-black">
				{featured.length
					? 'There are no other events listed right now.'
					: `There are no ${showPast ? '' : 'upcoming '}events listed right now. Please check back soon.`}
			</div>
		</div>
	{/if}
	{/key}
</div>
