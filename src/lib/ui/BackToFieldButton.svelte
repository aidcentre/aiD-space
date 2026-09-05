<script lang="ts">
	/**
	 * Leaves the search transcript and hands the screen back to the node
	 * field. Results cover the field completely, so without this the only way
	 * back to the full view is a page reload.
	 */
	import ArrowUp from 'phosphor-svelte/lib/ArrowUp';
	import { squircle } from '$lib/utils/squircle';

	let { onclick }: { onclick?: () => void } = $props();
</script>

<button
	use:squircle={{ radius: 8 }}
	type="button"
	{onclick}
	class="group ease-out-expo flex cursor-pointer items-center gap-3 bg-off-black px-3 py-2 font-[IBM_Mono] text-[14px] leading-[18px] tracking-[0.28px] text-white transition-colors duration-500 select-none hover:bg-white hover:text-off-black"
>
	<ArrowUp
		class="ease-out-expo size-4 shrink-0 fill-white transition-colors duration-500 group-hover:fill-off-black"
	/>
	Back to the node field
</button>
