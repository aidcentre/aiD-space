<script lang="ts">
	import LinkWithArrow from './LinkWithArrow.svelte';
	import LogoTemplate from './LogoTemplate.svelte';

	let projectBy = ['ntnu_logo', 'sintef_logo', 'norway_research_council_logo'];
</script>

<section class="mt-10 mb-12 flex w-full flex-col items-center justify-center md:mt-40 md:mb-30">
	<div class="flex w-full flex-col justify-start px-[1rem] md:w-6/13 md:px-0">
		<p class="mb-6 text-[2rem] leading-[3rem] font-bold md:text-[3rem] md:leading-[4rem]">
			About & contact
		</p>
		<div class="flex flex-col gap-4.5">
			<p
				class="font-[Montagu_Slab] text-[1rem] leading-[1.5rem] font-normal md:text-[1.44rem] md:leading-[2rem]"
			>
				aiD is headquartered at the Norwegian University of Science and Technology in Trondheim,
				Norway and at SINTEF, Norway.
			</p>
			<div class="flex flex-col text-[1rem] leading-[1.5rem] font-bold">
				<span>info@aid-research.com</span>
				<span>+47 22 22 55 55</span>
			</div>
		</div>
		<div class="mt-6">
			<LinkWithArrow label="aiD at The Research Council of Norway" />
		</div>
		<p class="mt-12 text-[1rem] leading-[1.5rem] font-bold sm:mt-16">A project by</p>
		<div class="mt-[1rem] flex flex-wrap gap-6">
			{#each projectBy as orgName}
				<LogoTemplate name={orgName} />
			{/each}
		</div>
	</div>
</section>

<style>
</style>
