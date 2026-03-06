<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	// retire tornado component. reincorporate later when we build a more complete version of the site
	import Tornado from '$lib/archive/Tornado.svelte';
	import WhatIsAid from '$lib/about/AboutAidHero.svelte';
	import ResearchAreasHero from '$lib/about/ResearchAreasHero.svelte';
	import MissionGoalsHero from '$lib/about/MissionGoalsHero.svelte';
	import ImpactUseCaseHero from '$lib/about/ImpactUseCaseHero.svelte';
	import EthicsHero from '$lib/about/EthicsHero.svelte';
	import Footer from '$lib/ui/Footer.svelte';
</script>

<svelte:head>
	<title>What is aiD? | aiD</title>
</svelte:head>

<NavHeader version={0.1} nodeNum={2} />

<main>
	<section class="mt-[15rem] flex h-fit items-center px-2 sm:px-4">
		<p
			class="mr-1 text-[1rem] leading-6 font-bold text-off-black sm:ml-2 sm:w-54/100 sm:text-[1.5rem] sm:leading-8"
		>
			The Norwegian Centre on AI for Decisions (aiD) is a premier research hub dedicated to
			advancing the role of artificial intelligence in complex decision-making processes. As a
			cornerstone of the Research Council of Norway's (RCN) AI portfolio, aiD bridges technological,
			organizational, and human-centric gaps to foster a society where AI-driven value creation is
			safe and ethical.
		</p>
	</section>
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
		gap: 15rem;
	}
</style>
