<script lang="ts">
	import { gsap } from 'gsap';
	import { tick } from 'svelte';
	import { partners_data } from '$lib/data/partners';
	import Logo from './LogoTemplate.svelte';
	import Scramble from '$lib/actions/Scramble.svelte';

	let activeCategory = $state('Core');
	let displayedPartners = $state(partners_data.filter((p) => p.category === 'Core'));
	let container: HTMLElement = $state()!;

	const counts = $derived({
		Core: partners_data.filter((p) => p.category === 'Core').length,
		Standard: partners_data.filter((p) => p.category === 'Standard').length,
		Networking: partners_data.filter((p) => p.category === 'Networking').length
	});

	async function switchCategory(category: string) {
		if (category === activeCategory) return;
		activeCategory = category;

		// animate tiles out
		const tiles = container.querySelectorAll('.partner-tile');
		if (tiles.length) {
			await gsap.to(tiles, { opacity: 0, duration: 0.15, ease: 'power2.in' });
		}

		// swap the data and wait for svelte to render new tiles
		displayedPartners = partners_data.filter((p) => p.category === category);
		await tick();

		// animate in new tiles with stagger
		const newTiles = container.querySelectorAll('.partner-tile');
		gsap.fromTo(
			newTiles,
			{ opacity: 0, y: 10 },
			{ opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.03 }
		);
	}
</script>

<div class="mt-12 mb-16 px-4 sm:mt-22">
	<Scramble text="Our partners" class="mb-6 text-[1.5rem] leading-[2rem] font-bold" />

	<nav class="filter-nav pb-1">
		<button class:active={activeCategory === 'Core'} onclick={() => switchCategory('Core')}>
			Core partners ({counts.Core})
		</button>

		<button class:active={activeCategory === 'Standard'} onclick={() => switchCategory('Standard')}>
			Standard partners ({counts.Standard})
		</button>

		<button
			class:active={activeCategory === 'Networking'}
			onclick={() => switchCategory('Networking')}
		>
			Networking partners ({counts.Networking})
		</button>
	</nav>

	<div bind:this={container} class="flex flex-wrap gap-1">
		{#each displayedPartners as partner (partner.name)}
			<div class="partner-tile flex w-fit items-center rounded-xl bg-white p-8 sm:p-10">
				<Logo name={partner.logo} />
			</div>
		{/each}
	</div>
</div>

<style>
	.filter-nav {
		display: flex;
		flex-wrap: nowrap;
		gap: 1.5rem;
		margin-bottom: 1rem;
		overflow-x: auto;
	}

	.filter-nav button {
		background: none;
		border: none;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--grey);
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
		text-wrap: nowrap;
	}

	.filter-nav button.active {
		color: var(--off-black);
	}
</style>
