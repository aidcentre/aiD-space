<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';
	import WhatIsAid from '$lib/about/AboutAidHero.svelte';
	import ResearchAreasHero from '$lib/about/ResearchAreasHero.svelte';
	import MissionGoalsHero from '$lib/about/MissionGoalsHero.svelte';
	import UseCases from '$lib/about/UseCases.svelte';
	import EthicsHero from '$lib/about/EthicsHero.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';

	let text = "The Norwegian Centre on AI for Decisions (aiD) is a premier research hub dedicated to advancing the role of artificial intelligence in complex decision-making processes. As a cornerstone of the Research Council of Norway's (RCN) AI portfolio, aiD bridges technological, organizational, and human-centric gaps to foster a society where AI-driven value creation is safe and ethical.";
</script>

<Header />
<Menu />

<main class="dark:bg-off-black transition-colors duration-800 ease-out-expo">
	<section>
		<div class="pt-40 md:pt-50 lg:pt-70 mb-30 md:mb-40 lg:mb-60 max-w-[1920px] px-4 mx-auto">
			<Scramble
				text={text}
				speed="fast"
				class="font-bold text-off-black w-full md:w-150 lg:w-200 xl:w-250 text-lg lg:text-xl xl:text-2xl leading-tight"
			/>
		</div>
	</section>
	<WhatIsAid />
	<ResearchAreasHero />
	<UseCases />
	<MissionGoalsHero />
	<EthicsHero />
</main>

<Footer />