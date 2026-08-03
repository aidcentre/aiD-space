<script lang="ts">
	import type { AidEvent } from '$lib/sanity/types';
	import Scramble from '$lib/actions/Scramble.svelte';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import { formatEventDates, formatEventLocation, formatEventType } from './eventUtils';

	let { event }: { event: AidEvent } = $props();

	const dateLabel = $derived(formatEventDates(event));
	const locationLabel = $derived(formatEventLocation(event));
	const typeLabel = $derived(formatEventType(event.eventType));
</script>

<a
	href={event.slug ? `/events/${event.slug}` : '#'}
	class="group flex flex-col rounded-xl bg-white hover:bg-off-black transition-colors duration-800 ease-out-expo"
>
	<div class="overflow-hidden flex items-start gap-2.5 md:gap-3 lg:gap-4 p-3 md:p-5 lg:p-6 border-b border-light-grey group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">
		<div class="hidden md:block w-3.75 h-3.75 md:w-4.5 md:h-4.5 aspect-square rounded scale-0 -ml-7 lg:-ml-9 translate-y-1 group-hover:ml-0 group-hover:bg-white group-hover:scale-100 transition-ml duration-800 ease-out-expo"></div>
		<Scramble
			text={event.title ?? ''}
			speed="slow"
			class="min-w-0 flex-1 text-md md:text-lg lg:text-xl font-bold leading-snug break-words text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo"
		/>
		<ArrowUpRight
			class="ml-auto shrink-0 self-start w-4.5 h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo"
		/>
	</div>
	{#if event.excerpt}
		<div class="flex px-3 md:px-5 lg:px-6 py-2.5 lg:py-4 border-b border-light-grey group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">
			<div class="font-family-mono text-xs md:text-sm text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo">{event.excerpt}</div>
		</div>
	{/if}
	<div class="flex flex-col md:flex-row md:items-center md:flex-wrap">
		{#if dateLabel}
			<span class="font-family-mono text-xs md:text-sm text-off-black px-3 md:px-5 lg:px-6 py-2.5 lg:py-4 group-hover:text-white transition-colors duration-800 ease-out-expo">{dateLabel}</span>
		{/if}
		{#if typeLabel}
			<span class="font-family-mono text-xs md:text-sm text-off-black border-t border-light-grey md:border-t-0 md:border-l border-l-0 px-3 md:px-5 lg:px-6 py-2.5 lg:py-4 group-hover:text-white group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">{typeLabel}</span>
		{/if}
		{#if locationLabel}
			<span class="font-family-mono text-xs md:text-sm text-off-black border-t border-light-grey md:border-t-0 md:border-l border-l-0 px-3 md:px-5 lg:px-6 py-2.5 lg:py-4 group-hover:text-white group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">{locationLabel}</span>
		{/if}
	</div>
</a>
