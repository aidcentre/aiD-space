<script lang="ts" module>
	import type { MorphData } from './morphData';

	/** Prepared articles, most recent last; each is ~3.8 MB of attributes. */
	const prepared = new Map<string, Promise<MorphData>>();
	const KEEP = 8;

	function morphFor(url: string, prepare: (url: string) => Promise<MorphData>) {
		let data = prepared.get(url);
		if (data) prepared.delete(url);
		else data = prepare(url);
		prepared.set(url, data);
		while (prepared.size > KEEP) prepared.delete(prepared.keys().next().value!);
		data.catch(() => prepared.delete(url));
		return data;
	}
</script>

<script lang="ts">
	/**
	 * A node's hover thumbnail as morphing particles (see particleMorph.ts).
	 *
	 * Mounted once; the frame stays the size of the old thumbnail so the
	 * tooltip lays out as before, and the canvas overhangs it on every side
	 * so particles can swing out mid-morph. It draws only while `active`, plus
	 * long enough after to cover the tooltip's fade-out.
	 *
	 * Shows the first still as a plain image when the visitor prefers reduced
	 * motion or the browser has neither WebGPU nor WebGL 2.
	 */
	import { onMount } from 'svelte';
	import type { Backend, ParticleMorph } from './particleMorph';
	import { FRAME_PADDING, STILLS } from './morphData';

	let {
		sheet,
		active,
		class: className = '',
		style = '',
		forceWebGL = false,
		onbackend
	}: {
		/** Sprite sheet of the article's four stills, or null for none. */
		sheet: string | null;
		active: boolean;
		class?: string;
		style?: string;
		/** Skip WebGPU even where the browser has it. */
		forceWebGL?: boolean;
		onbackend?: (backend: Backend | 'static') => void;
	} = $props();

	/** Matches the tooltip's 800 ms fade, with some slack. */
	const LINGER_MS = 1000;

	let canvas = $state<HTMLCanvasElement>();
	let morph: ParticleMorph | null = null;
	let ready = $state(false);
	let fallback = $state(false);
	let shown: string | null = null;
	let frame = 0;
	let stopAt = 0;

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			fallback = true;
			onbackend?.('static');
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				// Loaded on demand so three/webgpu stays out of every other route.
				const { ParticleMorph } = await import('./particleMorph');
				if (cancelled || !canvas) return;
				const instance = new ParticleMorph(canvas, { forceWebGL });
				const backend = await instance.init();
				if (cancelled) return instance.dispose();
				morph = instance;
				ready = true;
				onbackend?.(backend);
			} catch (error) {
				console.warn('Particle thumbnails unavailable, showing stills', error);
				fallback = true;
				onbackend?.('static');
			}
		})();
		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			morph?.dispose();
			morph = null;
		};
	});

	function loop(now: number) {
		morph?.render(now);
		frame = active || now < stopAt ? requestAnimationFrame(loop) : 0;
	}

	// New article: prepare (or reuse) its particle data, then restart the loop.
	$effect(() => {
		const url = sheet;
		if (!ready || !url || url === shown) return;
		shown = url;
		import('./particleMorph').then(({ prepareMorph }) =>
			morphFor(url, prepareMorph).then(
				(data) => {
					if (shown === url) morph?.show(data);
				},
				(error) => console.warn('Could not load', url, error)
			)
		);
	});

	$effect(() => {
		if (!ready) return;
		if (active) {
			stopAt = Infinity;
			if (!frame) frame = requestAnimationFrame(loop);
		} else {
			stopAt = performance.now() + LINGER_MS;
		}
	});
</script>

<!--
	The outer frame carries only what the tooltip passes in (it is `absolute`
	beside the node there). Its own CSS must not set `position`: Tailwind's
	utilities live in a cascade layer, so any unlayered rule here would beat
	`.absolute` and drop the frame into the flow, shoving the card down.
-->
<div class={className} {style}>
	<div class="particle-stage">
		{@render media()}
	</div>
</div>

{#snippet media()}
	{#if fallback}
		{#if sheet}
			<div
				class="still"
				style:background-image="url('{sheet}')"
				style:background-size="{STILLS * 100}% 100%"
			></div>
		{/if}
	{:else}
		<!-- A canvas keeps its intrinsic size under `inset`, so size it outright. -->
		<canvas
			bind:this={canvas}
			style:left="-{FRAME_PADDING}px"
			style:top="-{FRAME_PADDING}px"
			style:width="calc(100% + {FRAME_PADDING * 2}px)"
			style:height="calc(100% + {FRAME_PADDING * 2}px)"
			aria-hidden="true"
		></canvas>
	{/if}
{/snippet}

<style>
	.particle-stage {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}

	canvas {
		position: absolute;
		max-width: none;
		pointer-events: none;
	}

	.still {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background-position: 0 0;
	}
</style>
