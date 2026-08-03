<script lang="ts">
	import type { AidEvent } from '$lib/sanity/types';
	import EventCard from './EventCard.svelte';

	let { events = [] }: { events?: AidEvent[] } = $props();

	const featured = $derived(events.filter((event) => event.featured));
	const sorted = $derived(
		[...events].sort(
			(a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime()
		)
	);
</script>

{#if featured.length}
	<div class="flex flex-col gap-3 rounded-xl border border-dashed border-off-black p-4 md:p-5 lg:p-6 mb-12">
		<div class="font-family-mono text-xs md:text-sm text-off-black">Featured events</div>
		{#each featured as event (event._id)}
			<EventCard {event} />
		{/each}
	</div>
{/if}

<div class="font-family-mono text-xs md:text-sm text-off-black mb-4">All Events</div>

{#if sorted.length}
	<div class="flex flex-col gap-3">
		{#each sorted as event (event._id)}
			<EventCard {event} />
		{/each}
	</div>
{:else}
	<div class="flex flex-col rounded-xl bg-white p-4 md:p-5 lg:p-6">
		<div class="font-family-mono text-xs md:text-sm text-off-black">
			There are no events listed right now. Please check back soon.
		</div>
	</div>
{/if}
