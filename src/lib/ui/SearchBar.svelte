<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
</script>

<div
	class="group absolute top-1/2 left-1/2 -mt-8 flex w-full max-w-200 -translate-x-1/2 -translate-y-1/2 flex-col gap-3 px-4"
>
	<Tooltip content="Click to open the aiD Expertise Search in a new tab" position="bottom">
		<a
			class="relative flex w-full cursor-pointer flex-col rounded-xl bg-white"
			href="https://aidexpertisesearch-nrmdnyesl7oppreljp2epb.streamlit.app/"
			target="_blank"
		>
			<div
				class="font-family-mono border-b border-light-grey px-3 py-3 text-xs select-none md:px-4 md:py-3 md:text-sm lg:text-base"
			>
				Search scientists // <span class="text-dark-grey"
					>Research topics, names or anything else</span
				>
			</div>
			<div
				class="font-family-mono text-grey relative flex items-center justify-between px-3 py-3 text-xs select-none md:px-4 md:py-3 md:text-sm lg:text-base"
			>
				Your query
				<button
					class="ease-out-expo pointer-events-auto absolute top-1/2 right-2 flex aspect-square -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-off-black p-1.5 leading-0 text-white transition-colors duration-800 group-hover:bg-light-grey md:p-2"
					aria-label="Search scientists // Research topics, names or anything else"
				>
					<ArrowRight
						class="ease-out-expo h-3 w-3 transition-colors duration-800 group-hover:fill-off-black lg:h-4 lg:w-4"
					/>
				</button>
			</div>
		</a>
	</Tooltip>
</div>
