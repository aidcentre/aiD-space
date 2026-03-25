<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import ArrowRight from "phosphor-svelte/lib/ArrowRight"; 
</script>

<div
	class="group absolute top-1/2 left-1/2 -mt-8 flex w-full px-4 max-w-200 -translate-x-1/2 -translate-y-1/2 flex-col gap-3"
>
	<Tooltip content="Click to open the aiD Expertise Search in a new tab" position="bottom">
	<a
		class="relative flex w-full flex-col bg-white rounded-xl cursor-pointer"
		href="https://aidexpertisesearch-nrmdnyesl7oppreljp2epb.streamlit.app/"
		target="_blank"
	>
		<div class="font-family-mono text-xs md:text-sm lg:text-base border-b border-light-grey px-3 py-3 md:px-4 md:py-3 select-none">
			Search scientists // <span class="text-dark-grey">Research topics, names or anything else</span>
		</div>
		<div class="relative font-family-mono text-xs md:text-sm lg:text-base text-grey px-3 py-3 md:px-4 md:py-3 flex items-center justify-between select-none">
			Your query
			<button
				class="absolute top-1/2 right-2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-off-black text-white p-1.5 md:p-2 leading-0 aspect-square pointer-events-auto group-hover:bg-light-grey transition-colors duration-800 ease-out-expo"
				aria-label="Search scientists // Research topics, names or anything else"
			>
				<ArrowRight class="w-3 h-3 lg:w-4 lg:h-4 group-hover:fill-off-black transition-colors duration-800 ease-out-expo" />
			</button>
		</div>
	</a>
	</Tooltip>
</div>