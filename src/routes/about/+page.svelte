<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	// retire tornado component. reincorporate later when we build a more complete version of the site
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
	<p class=" ml-6 flex h-[46vh] w-6/11 items-center text-[1.2rem] font-extrabold">
		The Norwegian Centre on AI for Decisions (aiD) is a premier research hub dedicated to advancing
		the role of artificial intelligence in complex decision-making processes. As a cornerstone of
		the Research Council of Norway's (RCN) AI portfolio, aiD bridges technological, organizational,
		and human-centric gaps to foster a society where AI-driven value creation is safe and ethical.
	</p>
	<!-- <Tornado /> , uncomment when ready-->
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
