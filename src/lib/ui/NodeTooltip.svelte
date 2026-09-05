<script lang="ts">
	/**
	 * The glass card that appears beside the node under the cursor, and the
	 * node label that stays behind once one is opened.
	 *
	 * Rendered once and moved by NodeField, which parks its parent anchor on
	 * the active node every frame. Only one node is ever active, so there is no
	 * reason to mount ~280 of these.
	 */
	import { squircle } from '$lib/utils/squircle';
	import { useScramble } from '$lib/actions/useScramble';
	import { formatPublicationDate, type Article } from '$lib/data/articles';

	// Served straight out of static/. Every node shares one image for now.
	const tooltipImage = '/images/nodes/node-tooltip-image.png';

	let {
		article,
		selected = false,
		onclose
	}: {
		article: Article | null;
		selected?: boolean;
		onclose?: () => void;
	} = $props();

	// Hover details give way to the label once the panel is open.
	const detailsVisible = $derived(!!article && !selected);

	let numberEl = $state<HTMLSpanElement>();
	let activeNumberEl = $state<HTMLSpanElement>();

	function scrambleDigits(element: HTMLElement, text: string) {
		return useScramble(element, {
			text,
			playOnMount: true,
			speed: 1,
			tick: 2,
			step: 8,
			scramble: 8,
			seed: 2,
			chance: 1,
			range: [48, 57]
		});
	}

	let hoverScrambler: ReturnType<typeof useScramble> | null = null;
	let activeScrambler: ReturnType<typeof useScramble> | null = null;

	// `update` replays the digits, which is exactly the effect we want each
	// time the cursor crosses to another node.
	$effect(() => {
		const number = article?.nodeNumber;
		if (!number || !numberEl) return;
		if (hoverScrambler) hoverScrambler.update({ text: number });
		else hoverScrambler = scrambleDigits(numberEl, number);
	});

	$effect(() => {
		const number = article?.nodeNumber;
		if (!number || !activeNumberEl) return;
		if (activeScrambler) activeScrambler.update({ text: number });
		else activeScrambler = scrambleDigits(activeNumberEl, number);
	});

	$effect(() => () => {
		hoverScrambler?.destroy();
		activeScrambler?.destroy();
	});
</script>

<!-- A zero-size anchor: everything below is positioned relative to the node. -->
<div class="pointer-events-none relative h-0 w-0">
	<div class="absolute top-0 left-0">
		<img
			use:squircle={{ radius: 8 }}
			src={tooltipImage}
			alt=""
			aria-hidden="true"
			class="node-image absolute top-0 right-[calc(100%+24px)] ease-out-expo transition-[opacity,transform] duration-800"
			style:opacity={detailsVisible ? 1 : 0}
			style:transform={detailsVisible ? 'translate(0,0)' : 'translate(-10%, -10%)'}
			style:transition-delay={detailsVisible ? '80ms' : '0ms'}
		/>

		<div
			class="ml-6 flex flex-col items-start gap-4 ease-out-expo transition-[opacity,transform] duration-800"
			style:opacity={detailsVisible ? 1 : 0}
			style:transform={detailsVisible ? 'translate(0,0)' : 'translate(-10%, -10%)'}
		>
			<div class="relative">
				<div
					use:squircle={{ radius: 8 }}
					class="node-pill absolute bottom-full left-0 mb-2"
				>
					node // <span bind:this={numberEl} aria-label={article?.nodeNumber}></span>
				</div>
				<div
					use:squircle={{ radius: 8 }}
					class="flex w-[350px] max-w-[min(350px,70vw)] flex-col gap-2 bg-white/80 p-4 text-left text-off-black backdrop-blur-[10px]"
				>
					<p class="m-0 font-[Milling] text-[18px] leading-[130%] font-bold">
						{article?.title ?? ''}
					</p>
					<p class="m-0 line-clamp-4 font-[IBM_Math] text-[14px] leading-[130%]">
						{article?.teaser ?? ''}
					</p>
				</div>
			</div>

			<div
				class="flex flex-col items-start gap-2 ease-out-expo transition-[opacity,transform] duration-800"
				style:opacity={detailsVisible ? 1 : 0}
				style:transform={detailsVisible ? 'translate(0,0)' : 'translate(-10%, -10%)'}
				style:transition-delay={detailsVisible ? '140ms' : '0ms'}
			>
				<div use:squircle={{ radius: 8 }} class="node-pill">content-type // Article</div>
				<div use:squircle={{ radius: 8 }} class="node-pill">
					publication-date // {formatPublicationDate(article?.publicationDate ?? null)}
				</div>
			</div>
		</div>
	</div>

	<div
		class="absolute top-6 left-6 flex flex-col items-start gap-4 transition-[opacity] duration-150 ease-in-out"
		class:pointer-events-auto={selected}
		style:opacity={selected ? 1 : 0}
	>
		<div class="flex items-center gap-2">
			<div use:squircle={{ radius: 8 }} class="node-pill node-pill-active">
				node // <span bind:this={activeNumberEl} aria-label={article?.nodeNumber}></span>
			</div>
			<button
				use:squircle={{ radius: 8 }}
				type="button"
				class="node-pill node-pill-active cursor-pointer"
				aria-label="Close article"
				onclick={onclose}
			>
				X
			</button>
		</div>
		<img
			use:squircle={{ radius: 8 }}
			src={tooltipImage}
			alt=""
			aria-hidden="true"
			class="node-image"
		/>
	</div>
</div>

<style>
	.node-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.25ch;
		padding: 8px;
		border-radius: 8px;
		white-space: nowrap;
		font-family: 'IBM Mono', courier, monospace;
		font-size: 14px;
		line-height: 100%;
		color: var(--color-off-black);
		background: rgb(150 150 150 / 0.5);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.node-pill-active {
		background: var(--color-off-black);
		color: #fff;
	}

	.node-image {
		display: block;
		width: 162px;
		height: 176px;
		border-radius: 8px;
		object-fit: cover;
	}
</style>
