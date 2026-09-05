<script lang="ts">
	/**
	 * The black pill search bar from the prototype.
	 *
	 * Deliberately not positioned: it renders as a plain block so the homepage
	 * can pin it over the node field while /chat keeps it in normal flow. The
	 * `onsubmit` / `loading` API is unchanged from the version this replaces.
	 */
	import { squircle } from '$lib/utils/squircle';
	import { useScramble } from '$lib/actions/useScramble';

	let { onsubmit, loading = false }: { onsubmit: (query: string) => void; loading?: boolean } =
		$props();

	const PLACEHOLDERS = [
		'Research topics',
		'Scientists',
		'Machine learning',
		'Industry partners',
		'Anything else'
	];
	const CYCLE_MS = 2400;

	let userQuery = $state('');
	let placeholderEl = $state<HTMLSpanElement>();

	function handleSubmit() {
		const q = userQuery.trim();
		if (!q || loading) return;
		userQuery = '';
		onsubmit(q);
	}

	$effect(() => {
		if (!placeholderEl) return;

		let index = 0;
		const scrambler = useScramble(placeholderEl, {
			text: PLACEHOLDERS[0],
			playOnMount: true,
			speed: 1,
			tick: 2,
			step: 4,
			scramble: 6,
			seed: 2,
			range: [65, 90]
		});

		const timer = setInterval(() => {
			index = (index + 1) % PLACEHOLDERS.length;
			scrambler.update({ text: PLACEHOLDERS[index] });
		}, CYCLE_MS);

		return () => {
			clearInterval(timer);
			scrambler.destroy();
		};
	});
</script>

<form
	use:squircle={{ radius: 8 }}
	role="search"
	aria-label="Search the aiD research base"
	onsubmit={(event) => {
		event.preventDefault();
		handleSubmit();
	}}
	class="flex h-14 w-full max-w-[700px] items-center gap-3 bg-off-black py-0 pr-3 pl-5 font-[IBM_Mono] text-[14px] leading-[18px] tracking-[0.28px]"
>
	<label class="text-white select-none" for="research-topic-search">Search</label>

	<div class="relative flex min-w-0 flex-1 items-center">
		<input
			id="research-topic-search"
			bind:value={userQuery}
			type="search"
			autocomplete="off"
			disabled={loading}
			class="h-[18px] w-full border-none bg-transparent p-0 font-[IBM_Mono] text-[14px] leading-[18px] tracking-[0.28px] text-white focus:outline-none disabled:cursor-not-allowed"
		/>
		<span
			bind:this={placeholderEl}
			aria-hidden="true"
			class="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-medium-grey transition-opacity duration-150 ease-in-out"
			class:opacity-0={userQuery.length > 0}
		></span>
	</div>

	<button
		use:squircle={{ radius: 6 }}
		type="submit"
		disabled={loading}
		aria-label="Submit search"
		class="ease-out-expo flex size-8 shrink-0 cursor-pointer items-center justify-center bg-off-black text-[16px] text-white transition-colors duration-500 hover:bg-white hover:text-off-black disabled:cursor-not-allowed disabled:opacity-60"
	>
		→
	</button>
</form>

<style>
	input:focus {
		box-shadow: none !important;
		outline: none;
	}

	/* The pill supplies its own submit control. */
	input[type='search']::-webkit-search-cancel-button {
		display: none;
	}
</style>
