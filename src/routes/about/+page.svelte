<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	import Tornado from '$lib/ui/Tornado.svelte';
	import WhatIsAid from '$lib/about/AboutAidHero.svelte';
	import ResearchAreasHero from '$lib/about/ResearchAreasHero.svelte';
	import MissionGoalsHero from '$lib/about/MissionGoalsHero.svelte';
	import ImpactUseCaseHero from '$lib/about/ImpactUseCaseHero.svelte';
	import EthicsHero from '$lib/about/EthicsHero.svelte';
	import Footer from '$lib/ui/Footer.svelte';
</script>

<NavHeader version={0.1} nodeNum={2} />

<main>
	<Tornado />
	<WhatIsAid />
	<ResearchAreasHero />
	<ImpactUseCaseHero />
	<MissionGoalsHero />
	<EthicsHero />
	<Footer />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 7rem;
	}
</style>
