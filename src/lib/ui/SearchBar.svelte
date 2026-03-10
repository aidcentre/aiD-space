<script>
	let searchQuery = '';
	import enterIcon from '$lib/assets/enter_icon.svg';
	import { tooltip } from 'svooltip';
	import 'svooltip/styles.css'; // include default styling
</script>

<!-- note: make text in input box wrap? if so, where does the extra go? -->
<div
	class="mx-8 flex w-full max-w-[700px] flex-1 flex-col items-start justify-center gap-3 px-4 py-2"
>
	<a
		class="pointer-events-auto relative flex w-full items-center"
		href="https://aidexpertisesearch-nrmdnyesl7oppreljp2epb.streamlit.app/"
		target="_blank"
		use:tooltip={{
			content: 'Click to open the aiD Expertise Search in a new tab.',
			offset: 16
		}}
	>
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
	</a>

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
