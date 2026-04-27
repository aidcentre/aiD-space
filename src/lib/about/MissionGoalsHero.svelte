<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';
	import SectionLabel from './SectionLabel.svelte';

	let milestones = [
		'400 MSc students educated',
		'30 PhDs/postdocs graduated',
		'50 Researchers strengthened'
	];
</script>

<section class="grid grid-cols-1 gap-10 px-4 text-off-black xl:grid-cols-[1fr_5fr] xl:gap-0">
	<SectionLabel label="Mission and Goals" />
	<div class="flex flex-col gap-10">
		<p
			class="w-full font-[Montagu_Slab] leading-[1.5rem] font-[1rem] font-normal sm:w-4/5 xl:w-3/5 xl:text-[1.44rem] xl:leading-[2rem]"
		>
			A core mission of AID is to develop the next generation of AI experts. We aim to educate 400
			MSc students and 30 PhDs/postdocs, while strengthening the expertise of over 50 existing
			researchers. By pairing academic researchers with professional partners, we ensure that our
			training is grounded in real-world industrial and societal needs.
		</p>
		<div class="flex flex-col gap-[1rem]">
			<p class="text-[1rem] leading-[1.5rem] font-bold text-(--grey)">Key milestones</p>
			<div
				class="flex flex-col items-start justify-center gap-[1rem] sm:flex sm:w-17/20 sm:flex-row sm:justify-between"
			>
				<!-- render each milestone -->
				{#each milestones as ms}
					<div class="flex items-center gap-4">
						<div class="squircle"></div>
						<Scramble
							text={ms}
							class="font-[Milling] text-[1rem] leading-[1.5rem] font-bold xl:text-[1.5rem] xl:leading-[2rem]"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.squircle {
		height: 1.25rem;
		width: 1.25rem;
		min-width: 1.25rem;
		background-color: var(--off-black);
		border-radius: 6px;
		/* NOTE: Add corner-shape: squircle; */
	}
</style>
