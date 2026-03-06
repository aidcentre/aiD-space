<script>
	let { direction = 'left', label } = $props();
	// svelte-ignore non_reactive_update
	let ref;

	import arrowIcon from '$lib/assets/arrow_icon.svg';

	// svelte-ignore state_referenced_locally
	direction === 'left' ? (ref = '/') : (ref = '#top');
</script>

<a href={ref} class="hover-style flex items-center gap-2">
	<div
		class="flex aspect-square h-5 w-5 flex-nowrap items-center justify-center rounded-[4px] border border-light-grey p-1 text-[0.75rem]"
	>
		<!-- can instead put path directly. may be better to reduce HTTP requests -->
		{#if direction === 'left'}
			<img src={arrowIcon} alt="Arrow icon pointing left" />
		{:else}
			<img src={arrowIcon} alt="Arrow icon pointing up" class="rotate-90" />
		{/if}
	</div>
	<p class="text-[0.875rem] text-nowrap">{label}</p>
</a>

<style>
	:global(.hover-style):hover > div {
		background-color: var(--light-grey);
		color: var(--off-black);
	}

	:global(.hover-style):hover > div > img {
		filter: invert(100%);
	}
</style>
