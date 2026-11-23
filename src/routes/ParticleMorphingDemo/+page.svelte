<script lang="ts">
	/**
	 * /ParticleMorphingDemo: the node field with up to 50 articles whose hover
	 * thumbnails are particle morphs of four stills instead of looping WebMs.
	 *
	 * Standalone on purpose: no Sanity content, no search, no article panel.
	 * The articles are whichever have a sprite sheet from
	 * scripts/build_particle_demo_assets.py.
	 */
	import NodeField from '$lib/ui/NodeField.svelte';
	import NodeTooltip from '$lib/ui/NodeTooltip.svelte';
	import ParticleThumbnail from '$lib/particles/ParticleThumbnail.svelte';
	import { articles as allArticles, articleById } from '$lib/data/articles';
	import { particleSheets } from '$lib/data/particleDemo.generated';
	import { FRAME_HEIGHT, FRAME_WIDTH, HOLD, MORPH } from '$lib/particles/particleMorph';
	import type { Backend } from '$lib/particles/particleMorph';

	const NODE_COUNT = 50;
	const articles = allArticles.filter((article) => particleSheets[article.id]).slice(0, NODE_COUNT);

	let hoveredId = $state<string | null>(null);
	let anchorEl = $state<HTMLDivElement | null>(null);
	let backend = $state<Backend | 'static' | null>(null);

	const hoveredArticle = $derived(hoveredId ? (articleById(hoveredId) ?? null) : null);
	// Held through the tooltip's fade-out, so the particles do not vanish first.
	let lastSheet = $state<string | null>(null);
	$effect(() => {
		if (hoveredId) lastSheet = particleSheets[hoveredId] ?? null;
	});

	const BACKEND_LABEL = { webgpu: 'WebGPU', webgl2: 'WebGL 2', static: 'static stills' };
</script>

<svelte:head>
	<title>Particle morphing demo · aiD</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="fixed inset-0 -z-10">
	<NodeField {articles} bind:hoveredId anchor={anchorEl} onselect={() => {}} />
</div>

<div class="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
	<div bind:this={anchorEl} class="absolute top-0 left-0" style="visibility: hidden;">
		<NodeTooltip article={hoveredArticle}>
			{#snippet media(className, style, hover)}
				{#if hover}
					<ParticleThumbnail
						sheet={lastSheet}
						active={!!hoveredArticle}
						class={className}
						style="{style}; width: {FRAME_WIDTH}px; height: {FRAME_HEIGHT}px; border-radius: 8px;"
						onbackend={(value) => (backend = value)}
					/>
				{/if}
			{/snippet}
		</NodeTooltip>
	</div>
</div>

<aside class="demo-info">
	<p>particle-morphing-demo // {articles.length} nodes</p>
	<p>renderer // {backend ? BACKEND_LABEL[backend] : '…'}</p>
	<p>4 stills · {HOLD}s hold · {MORPH}s morph</p>
</aside>

<style>
	.demo-info {
		position: fixed;
		top: 16px;
		left: 16px;
		z-index: 4;
		display: flex;
		flex-direction: column;
		gap: 6px;
		pointer-events: none;
	}

	.demo-info p {
		margin: 0;
		width: fit-content;
		padding: 8px;
		border-radius: 8px;
		font-family: 'IBM Mono', courier, monospace;
		font-size: 14px;
		line-height: 100%;
		color: var(--color-off-black);
		background: rgb(150 150 150 / 0.5);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
</style>
