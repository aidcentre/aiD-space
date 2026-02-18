<script>
	import { partners_data } from '$lib/data/partners';
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

<div class="container">
	<h2>Our partners</h2>

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
			<div class="flex w-fit rounded-xl bg-white p-8">
				<Logo name={partner.logo} />
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		padding: 3rem 1rem;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 800;
		margin-bottom: 2rem;
	}

	.filter-nav {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.filter-nav button {
		background: none;
		border: none;
		font-size: 0.9rem;
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
