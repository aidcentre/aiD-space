<script lang="ts">
	import ButtonWithArrow from './ButtonWithArrow.svelte';
	import LogoTemplate from './LogoTemplate.svelte';

	let projectBy = ['ntnu_logo', 'sintef_logo', 'norway_research_council_logo'];
</script>

<section class="mt-10 mb-12 flex w-full flex-col items-center justify-center md:mt-30">
	<div class="flex w-full flex-col justify-start gap-6 px-[1rem] md:w-6/13 md:px-0">
		<p class="text-[2rem] leading-[3rem] font-bold md:text-[3rem] md:leading-[4rem]">
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
		<div class="mt-6 flex gap-2">
			<ButtonWithArrow label="aiD at NTNU" />
			<ButtonWithArrow label="aiD at SINTEF" />
		</div>
		<p class="text-[1rem] leading-[1.5rem] font-bold">A project by</p>
		<div class="flex flex-wrap gap-6">
			{#each projectBy as orgName}
				<LogoTemplate name={orgName} />
			{/each}
		</div>
	</div>
</section>

<style>
</style>
