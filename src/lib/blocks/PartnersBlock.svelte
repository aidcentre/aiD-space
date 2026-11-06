<script lang="ts">
	import { gsap } from 'gsap';
	import { tick } from 'svelte';
	import Scramble from '$lib/actions/Scramble.svelte';
	import { urlFor } from '$lib/sanity/image';
	import type { PartnerBucketEntry, PartnersBlockType } from '$lib/sanity/types';

	const { block }: { block: PartnersBlockType } = $props();

	const categories = [
		{ key: 'core', label: 'Core' },
		{ key: 'standard', label: 'Standard' },
		{ key: 'networking', label: 'Networking' }
	] as const;
	type CategoryKey = (typeof categories)[number]['key'];

	const partners = $derived(
		(block.partners ?? []).slice().sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
	);

	const counts = $derived({
		core: partners.filter((p) => p._type === 'core').length,
		standard: partners.filter((p) => p._type === 'standard').length,
		networking: partners.filter((p) => p._type === 'networking').length
	});

	const availableCategories = $derived(categories.filter((c) => counts[c.key] > 0));

	let activeCategory: CategoryKey = $state('core');
	let displayedPartners: PartnerBucketEntry[] = $state([]);
	let container: HTMLElement = $state()!;
	let initialized = false;

	$effect(() => {
		if (initialized) return;
		const first = availableCategories[0]?.key;
		if (!first) return;
		activeCategory = first;
		displayedPartners = partners.filter((p) => p._type === first);
		initialized = true;
	});

	async function switchCategory(category: CategoryKey) {
		if (category === activeCategory) return;
		activeCategory = category;

		const tiles = container?.querySelectorAll('.partner-tile');
		if (tiles?.length) {
			await gsap.to(tiles, { opacity: 0, duration: 0.15, ease: 'power2.in' });
		}

		displayedPartners = partners.filter((p) => p._type === category);
		await tick();

		const newTiles = container?.querySelectorAll('.partner-tile');
		if (newTiles?.length) {
			gsap.fromTo(
				newTiles,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.03 }
			);
		}
	}
</script>

<section>
	<div class="my-30 md:my-40 lg:my-60 mx-auto grid max-w-[1920px] grid-cols-12 gap-x-4 px-4 gap-y-8 lg:gap-y-12">
		<div class="col-span-12">
			<div class="flex flex-col gap-6">
				{#if block.title}
					<Scramble
						text={block.title}
						speed="slow"
						class="text-md font-bold text-off-black md:text-lg lg:text-xl"
					/>
				{/if}
			</div>
		</div>
		<div class="col-span-12">
			{#if availableCategories.length > 1}
				<div class="mb-4 flex flex-wrap gap-x-4 gap-y-2">
					{#each availableCategories as category (category.key)}
						<button
							class="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-xs md:text-base font-bold text-off-black whitespace-nowrap transition-colors duration-200 {activeCategory ===
							category.key
								? 'text-off-black'
								: 'text-grey'}"
							onclick={() => switchCategory(category.key)}
						>
							<div
								class="aspect-square size-3.5 rounded {activeCategory === category.key
									? 'bg-off-black'
									: 'border-2 border-grey'}"
							></div>
							{category.label} partners ({counts[category.key]})
						</button>
					{/each}
				</div>
			{/if}
			{#if displayedPartners.length}
				<div bind:this={container} class="flex flex-wrap gap-1">
					{#each displayedPartners as partner (partner._id)}
						{@const asset = partner.logo?.asset}
						{@const ink = partner.logoBounds ?? { x: 0, y: 0, w: 1, h: 1 }}
						{@const size = asset?.metadata?.dimensions}
						{@const ratio = size ? (ink.w * size.width) / (ink.h * size.height) : 1}
						<!-- Padding matches the vertical gap left by the logo's max height, so logos sit evenly inset -->
						<div
							class="partner-tile flex h-20 w-fit items-center justify-center rounded-lg bg-white px-5 lg:h-26 lg:rounded-xl lg:px-7 xl:h-32 xl:rounded-2xl xl:px-9"
						>
							{#if asset}
								<!-- A window onto just the logo's ink: the image is scaled and shifted so padding baked into the file falls outside it -->
								<div
									class="relative aspect-(--ratio) w-[min(8rem,2.5rem*var(--ratio))] overflow-hidden lg:w-[min(10rem,3rem*var(--ratio))] xl:w-[min(12rem,3.5rem*var(--ratio))]"
									style:--ratio={ratio}
								>
									<img
										src={urlFor(asset).height(Math.ceil(112 / ink.h)).fit('max').auto('format').url()}
										alt={partner.name ?? ''}
										class="absolute h-auto max-w-none"
										style:width="{100 / ink.w}%"
										style:left="{(-100 * ink.x) / ink.w}%"
										style:top="{(-100 * ink.y) / ink.h}%"
										loading="lazy"
									/>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>