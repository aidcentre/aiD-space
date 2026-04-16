<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	// pass in the function from +page.svelte as a prop
	let { onsubmit }: { onsubmit: (query: string) => void } = $props();
	let userQuery = $state('');

	function handleSubmit() {
		const q = userQuery;
		userQuery = '';
		onsubmit(q);
	}
</script>

<div
	class="group absolute bottom-4 left-1/2 -mt-8 flex w-full max-w-214 -translate-x-1/2 -translate-y-1/2 flex-col gap-3 px-4"
>
	<form
		method="POST"
		action="/"
		class="relative flex w-full cursor-pointer flex-col rounded-xl bg-white"
	>
		<div
			class="font-family-mono text-grey relative flex items-center justify-between px-3 py-3 text-xs select-none md:px-4 md:py-3 md:text-sm lg:text-base"
		>
			<input
				bind:value={userQuery}
				name="userQuery"
				type="text"
				placeholder="Your query"
				class="font-family-mono text-grey w-full cursor-text rounded-lg border-none bg-white p-0 text-xs font-light focus:outline-none md:text-sm lg:text-base"
			/>
			<button
				class="ease-out-expo pointer-events-auto absolute top-1/2 right-2 flex aspect-square -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-off-black p-1.5 leading-0 text-white transition-colors duration-800 group-hover:bg-light-grey md:p-2"
				aria-label="Search scientists // Research topics, names or anything else"
				onclick={handleSubmit}
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
