<script>
	import { partners_data } from '$lib/data/partners';
	import { fade } from 'svelte/transition';
	import Logo from './LogoTemplate.svelte';

	// use svelte 5 runes to get reactive state for the current filter, default to Core
	let activeCategory = $state('Core');

	// calculate how many partners are in each category
	const counts = $derived({
		Core: partners_data.filter((p) => p.category === 'Core').length,
		Standard: partners_data.filter((p) => p.category === 'Standard').length,
		Networking: partners_data.filter((p) => p.category === 'Networking').length
	});

	// filter the list whenever activeCategory changes
	const filteredPartners = $derived(partners_data.filter((p) => p.category === activeCategory));
</script>

<div class="mt-12 mb-16 px-4 sm:mt-22">
	<h2 class="mb-6 text-[1.5rem] leading-[2rem] font-bold">Our partners</h2>

	<nav class="filter-nav pb-1">
		<button class:active={activeCategory === 'Core'} onclick={() => (activeCategory = 'Core')}>
			Core partners ({counts.Core})
		</button>

		<button
			class:active={activeCategory === 'Standard'}
			onclick={() => (activeCategory = 'Standard')}
		>
			Standard partners ({counts.Standard})
		</button>

		<button
			class:active={activeCategory === 'Networking'}
			onclick={() => (activeCategory = 'Networking')}
		>
			Networking partners ({counts.Networking})
		</button>
	</nav>

	<div class="flex flex-wrap gap-1">
		{#each filteredPartners as partner (partner.name)}
			<div
				in:fade={{ duration: 100, delay: 100 }}
				out:fade={{ duration: 100 }}
				class="flex w-fit items-center rounded-xl bg-white p-8 transition-all sm:p-8 sm:p-10"
			>
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
