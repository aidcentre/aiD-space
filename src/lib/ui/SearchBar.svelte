<script>
	let searchQuery = '';
	import enterIcon from '$lib/assets/enter_icon.svg';
</script>

<!-- note: make text in input box wrap? if so, where does the extra go? -->
<div class="flex w-full flex-1 flex-col items-center justify-center px-8">
	<div class="pointer-events-auto w-full max-w-2xl">
		<div class="relative flex items-center">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Find a scientist"
				class="w-full cursor-text rounded-lg border-none bg-white py-3 pl-4 text-base text-(--dark-grey) focus:outline-none"
			/>

			<button
				class="absolute right-2 flex cursor-pointer items-center justify-center rounded-md bg-(--light-grey) p-2 hover:bg-gray-200"
				aria-label="Find a scientist"
			>
				<img src={enterIcon} alt="Arrow to click after entering query." />
			</button>
		</div>

		<p class="mt-3 text-[0.8rem] text-(--off-black)">
			Search for a research topic, name or anything else.
		</p>
	</div>
</div>

<style>
	input::placeholder {
		color: var(dark-grey);
	}

	/* prevent blue outline around input text box */
	input:focus {
		box-shadow: none !important;
		-moz-box-shadow: none !important;
		-webkit-box-shadow: none !important;
	}
</style>
