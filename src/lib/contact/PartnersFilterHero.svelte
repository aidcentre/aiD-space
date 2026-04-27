<script lang="ts">
	import { gsap } from 'gsap';
	import { tick } from 'svelte';
	import { partners_data } from '$lib/data/partners';
	import Logo from './LogoTemplate.svelte';
	import SectionLabel from '$lib/about/SectionLabel.svelte';

	const categories = ['Core', 'Standard', 'Networking'] as const;
	type Category = (typeof categories)[number];

	let activeCategory: Category = $state('Core');
	let displayedPartners = $state(partners_data.filter((p) => p.category === 'Core'));
	let container: HTMLElement = $state()!;

	const counts = $derived({
		Core: partners_data.filter((p) => p.category === 'Core').length,
		Standard: partners_data.filter((p) => p.category === 'Standard').length,
		Networking: partners_data.filter((p) => p.category === 'Networking').length
	});

	async function switchCategory(category: Category) {
		if (category === activeCategory) return;
		activeCategory = category;

		const tiles = container.querySelectorAll('.partner-tile');
		if (tiles.length) {
			await gsap.to(tiles, { opacity: 0, duration: 0.15, ease: 'power2.in' });
		}

		displayedPartners = partners_data.filter((p) => p.category === category);
		await tick();

		const newTiles = container.querySelectorAll('.partner-tile');
		gsap.fromTo(
			newTiles,
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.03 }
		);
	}
</script>

<section>
	<div class="mx-auto my-30 max-w-[1920px] px-4 md:my-40 lg:my-60">
		<div class="flex flex-col gap-6">
			<SectionLabel label="Our partners" />

			<div class="mb-1.5 flex flex-wrap gap-x-4 gap-y-2">
				{#each categories as category (category)}
					<button
						class="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[0.8rem] font-bold whitespace-nowrap transition-colors duration-200 {activeCategory ===
						category
							? 'text-off-black'
							: 'text-grey'}"
						onclick={() => switchCategory(category)}
					>
						<div
							class="aspect-square size-3.25 rounded {activeCategory === category
								? 'bg-off-black'
								: 'border-grey border-2'}"
						></div>
						{category} partners ({counts[category]})
					</button>
				{/each}
			</div>

			<div bind:this={container} class="flex flex-wrap gap-1">
				{#each displayedPartners as partner (partner.name)}
					<div class="partner-tile flex w-fit items-center rounded-xl bg-white p-8 sm:p-10">
						<Logo name={partner.logo} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
