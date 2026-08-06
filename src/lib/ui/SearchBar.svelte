<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';

	let { onsubmit, loading = false }: { onsubmit: (query: string) => void; loading?: boolean } =
		$props();

	let userQuery = $state('');

	function handleSubmit() {
		const q = userQuery.trim();
		if (!q || loading) return;
		userQuery = '';
		onsubmit(q);
	}
</script>

<div class="group flex w-full flex-col gap-3">
	<form
		onsubmit={(event) => {
			event.preventDefault();
			handleSubmit();
		}}
		class="relative flex w-full flex-col rounded-xl bg-white"
	>
		<div
			class="border-b border-light-grey px-3 py-3 font-family-mono text-xs select-none md:px-4 md:py-3 md:text-sm lg:text-base"
		>
			Search scientists // <span class="text-dark-grey"
				>Research topics, names, or anything else</span
			>
		</div>
		<div
			class="relative flex items-center justify-between px-3 py-3 font-family-mono text-xs text-grey md:px-4 md:py-3 md:text-sm lg:text-base"
		>
			<input
				bind:value={userQuery}
				name="userQuery"
				type="text"
				placeholder="Your query"
				autocomplete="off"
				disabled={loading}
				class="w-full cursor-text rounded-lg border-none bg-white p-0 pr-10 font-family-mono text-xs font-light text-grey focus:outline-none disabled:cursor-not-allowed md:text-sm lg:text-base"
			/>
			<button
				class="ease-out-expo pointer-events-auto absolute top-1/2 right-2 flex aspect-square -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-off-black p-1.5 leading-0 text-white transition-colors duration-800 group-hover:bg-light-grey disabled:cursor-not-allowed disabled:opacity-60 md:p-2"
				aria-label="Search scientists // Research topics, names, or anything else"
				type="submit"
				disabled={loading}
			>
				<ArrowRight
					class="ease-out-expo h-3 w-3 transition-colors duration-800 group-hover:fill-off-black lg:h-4 lg:w-4"
				/>
			</button>
		</div>
	</form>
	<p class="px-1 text-center font-family-mono text-[10px] font-light text-grey md:text-xs">
		You are interacting with an AI system. Responses are AI-generated and may be inaccurate.
	</p>
</div>

<style>
	input:focus {
		box-shadow: none !important;
		outline: none;
	}
</style>
