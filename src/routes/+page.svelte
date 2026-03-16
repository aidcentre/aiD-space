<script>
	import HomeHeader from '$lib/ui/HomeHeader.svelte';
	import SearchBar from '$lib/ui/SearchBar.svelte';
	import Tornado from '$lib/ui/Tornado.svelte';
	import { animate } from '$lib/actions/scramble_text';
	import Scramble from '$lib/actions/Scramble.svelte';

	let footerText =
		"The Norwegian Centre on AI for Decisions is building a scientific and technological foundation that makes reliable, real-world AI possible. We\'re building something great here. Watch this space.";
</script>

<!-- TODO: allow right-clicks even on tornado. currently not possible due to pointer events none -->

<Tornado />
<main class="pointer-events-none relative flex min-h-dvh flex-col items-center">
	<HomeHeader />
	<SearchBar />
	<footer
		class="w-full self-start px-3 pb-3 text-[1rem] leading-6 font-extrabold wrap-anywhere text-off-black sm:w-2/3 sm:text-[1.5rem] sm:leading-8"
	>
		<h1>
			<Scramble text={footerText} />
		</h1>
	</footer>
</main>
