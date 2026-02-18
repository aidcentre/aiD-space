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

<div class="px-4">
	<h2 class="mb-6 text-xl font-extrabold">Our partners</h2>

	<nav class="filter-nav">
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
				in:fade={{ duration: 300, delay: 200 }}
				out:fade={{ duration: 200 }}
				class="flex w-fit rounded-xl border border-transparent bg-white p-8 transition-all hover:border-blue-100"
			>
				<Logo name={partner.logo} />
			</div>
		{/each}
	</div>
</div>

<style>
	.filter-nav {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.filter-nav button {
		background: none;
		border: none;
		font-size: 0.8rem;
		font-weight: 600;
		color: #666;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.filter-nav button.active {
		color: #000;
	}
</style>
