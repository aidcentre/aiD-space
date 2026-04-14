<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";
	import { useScramble } from '$lib/actions/useScramble';

	interface Props extends HTMLAnchorAttributes {
		href: string;
		theme?: 'light' | 'dark';
		border?: boolean;
		children: Snippet;
		trailing?: boolean;
	}

	let { href, theme = 'light', border = false, children, trailing = false, class: className, ...rest }: Props = $props();

	let spanEl = $state<HTMLElement | null>(null);
	let scrambler: ReturnType<typeof useScramble> | undefined;

	$effect(() => {
		if (spanEl) {
			scrambler = useScramble(spanEl, {
				text: spanEl.textContent ?? '',
				playOnMount: false,
				scrollIntoView: false,
				speed: 0.6,
				tick: 1,
				step: 4,
				scramble: 4,
				seed: 3,
				overdrive: false,
				range: [48, 57],
			});
			return () => scrambler?.destroy();
		}
	});
</script>

<a
	{href}
	class={[
		'inline-flex items-center gap-1 md:gap-1.5 w-fit font-family-mono text-xs md:text-sm select-none',
		theme === 'light' ? 'text-off-black' : 'text-white',
		border && 'border-b border-dashed',
		className
	]}
	onmouseenter={() => scrambler?.replay()}
	{...rest}
>
	<span bind:this={spanEl}>{@render children()}</span>
	{#if trailing}
		<ArrowUpRight class="w-3.25 h-3.25 md:w-4 md:h-4" />
	{/if}
</a>
