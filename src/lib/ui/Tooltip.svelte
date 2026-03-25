<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		content: string;
		position?: 'top' | 'bottom';
		children: Snippet;
	}

	let { content, position = 'top', children }: Props = $props();
</script>

<div class="group relative inline-flex">
	{@render children()}
	<span
		class={[
			'hidden md:flex font-family-mono text-[10px] bg-off-black text-white px-1.5 py-1 rounded-md whitespace-nowrap pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-800 ease-out-expo',
			position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
		].join(' ')}
	>
		{content}
	</span>
</div>
