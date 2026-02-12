<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	import Tornado from '$lib/ui/Tornado.svelte';
	import WhatIsAid from '$lib/about/AboutAidHero.svelte';
	import ResearchAreasHero from '$lib/about/ResearchAreasHero.svelte';
</script>

<NavHeader version={0.1} nodeNum={2} />

<main>
	<Tornado />
	<WhatIsAid />
	<ResearchAreasHero />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 7rem;
	}
</style>
