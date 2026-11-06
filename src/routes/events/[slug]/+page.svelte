<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import Scramble from '$lib/actions/Scramble.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import { urlFor } from '$lib/sanity/image';
	import { formatEventDates, formatEventLocation, formatEventType } from '$lib/events/eventUtils';
	import AddToCalendarButton from '$lib/events/AddToCalendarButton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const event = $derived(data.event);

	const dateLabel = $derived(formatEventDates(event));
	const locationLabel = $derived(formatEventLocation(event));
	const typeLabel = $derived(formatEventType(event.eventType));
	const metaLabels = $derived([dateLabel, typeLabel, locationLabel].filter(Boolean));
</script>

<Header />
<Menu />

<main>
	<div class="mx-auto grid max-w-[1920px] grid-cols-12 gap-8 lg:gap-12 px-4 pt-30 md:pt-40 lg:pt-60 mb-30 md:mb-40 lg:mb-60">
		<div class="col-span-12">
			<div class="w-full h-8 bg-[url('/src/lib/assets/diagonal_squares_black.svg')] bg-center bg-repeat-x pointer-events-none"></div>
		</div>

		<div class="col-span-12">
			<a
				href="/events"
				class="group inline-flex items-center gap-2 font-family-mono text-xs md:text-sm text-off-black hover:opacity-60 transition-opacity duration-300"
			>
				<ArrowLeft class="w-4 h-4" />
				Back to events
			</a>
		</div>

		<div class="col-span-12 md:col-span-5">
			<Scramble
				text={event.title ?? 'Event'}
				speed="slow"
				class="text-3xl leading-tight font-bold lg:text-4xl xl:text-5xl -translate-y-2"
			/>
			{#if metaLabels.length}
				<div class="mt-6 flex flex-col gap-2">
					{#each metaLabels as label (label)}
						<div class="font-family-mono text-xs md:text-sm text-off-black">{label}</div>
					{/each}
				</div>
			{/if}
			<div class="mt-8 flex flex-wrap items-center gap-3">
				{#if event.registrationUrl}
					<a
						href={event.registrationUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 md:px-5 md:py-4 font-bold text-off-black hover:bg-off-black hover:text-white transition-colors duration-800 ease-out-expo"
					>
						More Info
						<ArrowUpRight class="w-4.5 h-4.5 md:w-5 md:h-5" />
					</a>
				{/if}
				{#if event.startDate}
					<AddToCalendarButton {event} />
				{/if}
			</div>
			{#if event.body?.length}
				<div class="mt-8 rounded-xl bg-white p-4 md:p-5 lg:p-6">
					<div class="prose max-w-none text-off-black">
						<PortableText value={event.body} />
					</div>
				</div>
			{/if}
		</div>

		<div class="col-span-12 md:col-span-7 flex flex-col gap-8">
			{#if event.image?.asset}
				<img
					src={urlFor(event.image).width(1600).url()}
					alt={event.title ?? ''}
					class="w-full rounded-xl"
				/>
			{/if}
			{#if event.speakers?.length}
				<div class="rounded-xl bg-white p-4 md:p-5 lg:p-6">
					<div class="font-family-mono text-xs md:text-sm text-off-black mb-4">Speakers</div>
					<div class="flex flex-col gap-3">
						{#each event.speakers as speaker (speaker._key)}
							<div class="flex items-center gap-3">
								{#if speaker.image?.asset}
									<img
										src={urlFor(speaker.image).width(96).height(96).fit('crop').url()}
										alt={speaker.name ?? ''}
										class="w-10 h-10 rounded-full object-cover"
									/>
								{/if}
								<div>
									<div class="font-bold text-off-black">{speaker.name}</div>
									{#if speaker.role}
										<div class="font-family-mono text-xs text-off-black">{speaker.role}</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
			{#if event.partners?.length}
				<div class="rounded-xl bg-white p-4 md:p-5 lg:p-6">
					<div class="font-family-mono text-xs md:text-sm text-off-black mb-4">Partners</div>
					<div class="flex flex-wrap items-center gap-6">
						{#each event.partners as partner (partner._id)}
							{#if partner.logo?.asset}
								<img
									src={urlFor(partner.logo).height(150).url()}
									alt={partner.name ?? ''}
									class="h-20 w-auto"
								/>
							{:else}
								<span class="font-family-mono text-sm text-off-black">{partner.name}</span>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<Footer />
