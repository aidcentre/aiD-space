<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';
	import WhatIsAid from '$lib/about/AboutAid.svelte';
	import ResearchAreas from '$lib/about/ResearchAreas.svelte';
	import MissionGoals from '$lib/about/MissionGoals.svelte';
	import UseCases from '$lib/about/UseCases.svelte';
	import Sustainability from '$lib/about/Sustainability.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';

	let text =
		"The Norwegian Centre on AI for Decisions (aiD) is a premier research hub dedicated to advancing the role of artificial intelligence in complex decision-making processes. As a cornerstone of the Research Council of Norway's (RCN) AI portfolio, aiD bridges technological, organizational, and human-centric gaps to foster a society where AI-driven value creation is safe and ethical.";
</script>

<Header />
<Menu />

<main>
	<section>
		<div class="mx-auto mb-30 max-w-[1920px] px-4 pt-40 md:mb-40 md:pt-50 lg:mb-60 lg:pt-70">
			<Scramble
				{text}
				speed="fast"
				class="w-full text-lg leading-tight font-bold text-off-black md:w-150 lg:w-200 lg:text-xl xl:w-250 xl:text-2xl"
			/>
		</div>
	</section>
	<WhatIsAid />
	<ResearchAreas />
	<UseCases />
	<MissionGoals />
	<Sustainability />
</main>

<Footer />
