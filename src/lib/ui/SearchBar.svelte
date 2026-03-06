<script>
	let searchQuery = '';
	import enterIcon from '$lib/assets/enter_icon.svg';
</script>

<!-- note: make text in input box wrap? if so, where does the extra go? -->
<div
	class="pointer-events-auto mx-8 flex w-full max-w-[700px] flex-1 flex-col items-start justify-center gap-3 px-4 py-2"
>
	<div class="relative flex w-full items-center">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Find a scientist"
			class="w-full cursor-text rounded-lg border-none bg-white py-3 pr-14 pl-4 focus:outline-none"
		/>

		<button
			class="absolute top-1/2 right-2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-(--light-grey) p-2"
			aria-label="Find a scientist"
		>
			<img src={enterIcon} alt="Arrow to click after entering query." />
		</button>
	</div>

	<p class="text-[0.75rem] font-bold text-(--off-black)">
		Search for a research topic, name or anything else.
	</p>
</div>

<style>
	input::placeholder {
		color: var(--mid-dark-grey);
		font-weight: 700;
		font-size: 1rem;
	}

	input:focus {
		box-shadow: none !important;
		outline: none;
	}
</style>
