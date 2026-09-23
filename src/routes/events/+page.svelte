<script lang="ts">
	import Footer from '$lib/ui/Footer.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import EventsList from '$lib/events/EventsList.svelte';
	import EventsCalendar from '$lib/events/EventsCalendar.svelte';
	import type { PageData } from './$types';
	import Scramble from '$lib/actions/Scramble.svelte';
	import { isPastEvent } from '$lib/events/eventUtils';
	import { tick } from 'svelte';

	let { data }: { data: PageData } = $props();

	/** Past events are hidden on every page load until the toggle is switched on. */
	let showPast = $state(false);
	/** The toggle flips straight away; `showPast` only follows once the old view has faded out. */
	let toggleOn = $state(false);
	/** While true every `.events-fade` element is transitioned to transparent (see <style>). */
	let fading = $state(false);

	const FADE_MS = 400;
	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const visibleEvents = $derived(
		(data.allEvents ?? []).filter((event) => showPast || !isPastEvent(event))
	);

	async function togglePast() {
		if (fading) return;
		toggleOn = !toggleOn;
		fading = true;
		await wait(FADE_MS);
		showPast = toggleOn;
		// Mount the new view while still transparent and force a style pass, so freshly
		// created cards transition in instead of popping straight to full opacity.
		await tick();
		void document.body.offsetHeight;
		fading = false;
	}
</script>

<Header />
<Menu />

<main class:fading>
	<div class="mx-auto grid max-w-[1920px] grid-cols-12 md:grid-rows-[auto_auto_1fr] gap-4 md:gap-8 lg:gap-12 px-4 pt-30 md:pt-40 lg:pt-60 mb-30 md:mb-40 lg:mb-60">
		<div class="col-span-12">
			<div class="w-full h-8 bg-[url('/src/lib/assets/diagonal_squares_black.svg')] bg-center bg-repeat-x pointer-events-none"></div>
		</div>
		<!-- Mobile keeps the DOM order (intro → list → calendar); from md the intro and calendar
		     stack in the left column with the list alongside them on the right. The 1fr last row
		     soaks up the list's extra height, so the calendar stays put however long the list is. -->
		<div class="col-span-12 md:col-span-5 md:col-start-1 md:row-start-2">
			<Scramble
				text="Events"
				speed="slow"
				class="text-3xl leading-tight font-bold lg:text-4xl xl:text-5xl -translate-y-2"
			/>
			{#if data.events?.introduction}
				<p class="mt-6 font-family-mono text-xs md:text-sm text-off-black max-w-100">
					{data.events.introduction}
				</p>
			{/if}
		</div>
		<div class="col-span-12 md:col-span-7 md:col-start-6 md:row-start-2 md:row-span-2 mt-12 md:mt-0">
			<EventsList events={visibleEvents} showPast={toggleOn} onTogglePast={togglePast} />
		</div>
		<div class="col-span-12 md:col-span-5 md:col-start-1 md:row-start-3 mt-12 lg:mt-16 events-fade">
			<EventsCalendar events={visibleEvents} />
		</div>
	</div>
</main>

<Footer />

<style>
	main :global(.events-fade) {
		transition: opacity 0.4s ease;
	}

	main.fading :global(.events-fade) {
		opacity: 0;
	}
</style>
