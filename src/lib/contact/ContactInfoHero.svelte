<script lang="ts">
	import ButtonWithArrow from './ButtonWithArrow.svelte';
	import LogoTemplate from './LogoTemplate.svelte';

	let projectBy = ['ntnu_logo', 'sintef_logo', 'norway_research_council_logo'];
</script>

<section class="mt-16 mb-10 flex w-full flex-col items-center justify-center">
	<div class="flex w-full flex-col justify-start gap-8 px-[1rem] md:w-6/13 md:px-0">
		<p class="text-4xl font-extrabold">About & contact</p>
		<p class="font-[Montagu_Slab] text-lg font-normal tracking-tight">
			aiD is headquartered at the Norwegian University of Science and Technology in Trondheim,
			Norway and at SINTEF, Norway.
		</p>
		<div class="-mt-4 flex flex-col text-[0.8rem]">
			<span class="font-bold">info@aid-research.com</span>
			<span class="mt-1 font-bold">+47 22 22 55 55</span>
		</div>
		<div class="flex gap-2">
			<ButtonWithArrow label="aiD at NTNU" />
			<ButtonWithArrow label="aiD at SINTEF" />
		</div>
		<p class="mt-6 text-sm font-bold">A project by</p>
		<div class="-mt-4 flex flex-wrap gap-6">
			{#each projectBy as orgName}
				<LogoTemplate name={orgName} />
			{/each}
		</div>
	</div>
</section>

<style>
</style>
