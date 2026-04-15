<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	let userQuery = $state('');
</script>

<div
	class="group absolute top-1/2 left-1/2 -mt-8 flex w-full max-w-200 -translate-x-1/2 -translate-y-1/2 flex-col gap-3 px-4"
>
	<form
		method="POST"
		action="/"
		class="relative flex w-full cursor-pointer flex-col rounded-xl bg-white"
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
			<input
				name="userQuery"
				type="text"
				placeholder="Your query"
				class="font-family-mono text-grey w-full cursor-text rounded-lg border-none bg-white p-0 text-xs font-light focus:outline-none md:text-sm lg:text-base"
			/>
			<button
				class="ease-out-expo pointer-events-auto absolute top-1/2 right-2 flex aspect-square -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-off-black p-1.5 leading-0 text-white transition-colors duration-800 group-hover:bg-light-grey md:p-2"
				aria-label="Search scientists // Research topics, names or anything else"
			>
				<ArrowRightIcon
					class="ease-out-expo h-3 w-3 transition-colors duration-800 group-hover:fill-off-black lg:h-4 lg:w-4"
				/>
			</button>
		</div>
	</form>
</div>

<style>
	input:focus {
		box-shadow: none !important;
		outline: none;
	}
</style>
