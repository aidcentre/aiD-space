<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import UNLogo from '$lib/assets/UN_logo_bw.svg';
	import SectionLabel from './SectionLabel.svelte';

	let milestones = [
		'400 MSc students educated',
		'30 PhDs/postdocs graduated',
		'50 Researchers strengthened'
	];
</script>

<section class="grid grid-cols-1 gap-10 px-4 text-off-black xl:grid-cols-[1fr_5fr] xl:gap-0">
	<SectionLabel label="Sustainablity and Ethics" />
	<div
		class="flex flex-col items-center justify-center gap-[3.5rem] rounded-3xl bg-white px-[1.5rem] py-[4rem] xl:w-5/6 xl:p-[7.5rem]"
	>
		<img class="w-[130px]" src={UNLogo} alt="Logo of the United Nations in black and white" />
		<p
			class="max-w-200 text-center font-[Montagu_Slab] text-[1rem] leading-[1.5rem] font-normal text-(--off-black) sm:text-[1.5rem] sm:leading-[2rem]"
		>
			Our research is fundamentally aligned with the UN Sustainable Development Goals (SDGs),
			specifically contributing to affordable and clean energy (SDG 7), good health and well-being
			(SDG 3), and sustainable industry and infrastructure (SDG 9). We strictly adhere to principles
			of Fairness, Accountability, Transparency, and Explainability (FATE) to ensure our solutions
			comply with the EU AI Act and OECD recommendations for trustworthy AI.
		</p>
	</div>
</section>
