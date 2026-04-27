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

<div
	class="*:h-auto *:max-h-5 *:w-full *:max-w-24 lg:*:max-h-6 lg:*:max-w-32 xl:*:max-h-7 xl:*:max-w-40"
>
	{#if svgContent}
		{@html svgContent}
	{/if}
</div>
