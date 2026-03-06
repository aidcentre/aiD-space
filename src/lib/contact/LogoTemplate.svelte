<script lang="ts">
	// combines all svgs in the /logos directory as strings at build time. a Vite capability
	// only one HTTP request rather than a GET request for each logo
	const logos = import.meta.glob('$lib/assets/logos/*.svg', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	let { name } = $props();

	// svelte-ignore state_referenced_locally
	const logoPath = `/src/lib/assets/logos/${name}.svg`;
	const svgContent = logos[logoPath];
</script>

<div class="logo-container flex h-5 w-auto items-center fill-current sm:h-8">
	{#if svgContent}
		{@html svgContent}
	{:else}
		<span class="text-sm">Logo not found</span>
	{/if}
</div>

<style>
	:global(.logo-container svg) {
		height: 100%;
		width: auto;
	}
</style>
