<script>
	import HomeHeader from '$lib/ui/HomeHeader.svelte';
	import SearchBar from '$lib/ui/SearchBar.svelte';
	import Tornado from '$lib/ui/Tornado.svelte';
</script>

<svelte:head>
	<title>AID Home</title>
</svelte:head>

<!-- TODO: allow right-clicks even on tornado. currently not possible due to pointer events none -->
<Tornado />

<main class="pointer-events-none relative flex min-h-dvh flex-col items-center">
	<HomeHeader />
	<SearchBar />
	<footer class="w-2/3 self-start px-3 pb-3">
		The Norwegian Center on AI for Decisions is building a scientific and technological foundation
		that makes reliable, real-world AI possible. We're building something great here. Watch this
		space.
	</footer>
</main>
