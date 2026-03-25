<script lang="ts">
	const logos = import.meta.glob('$lib/assets/logos/*.svg', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	let { name } = $props();

	const logoPath = $derived(`/src/lib/assets/logos/${name}.svg`);
	const svgContent = $derived(logos[logoPath]);
</script>

<div class="*:max-w-24 lg:*:max-w-32 xl:*:max-w-40 *:max-h-5 lg:*:max-h-6 xl:*:max-h-7 *:h-auto *:w-full">
	{#if svgContent}
		{@html svgContent}
	{/if}
</div>