<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import UNLogo from '$lib/assets/UN_logo_bw.svg';

	let milestones = [
		'400 MSc students educated',
		'30 PhDs/postdocs graduated',
		'50 Researchers strengthened'
	];
</script>

<section class="section">
	<div class="title-area">
		<Button
			label="Sustainability and Ethics"
			section_id="sustainability-and-ethics"
			section_ref="sustainability-and-ethics"
		/>
	</div>
	<div class="flex w-full items-center justify-center">
		<div
			class="flex w-5/6 flex-col items-center justify-center gap-12 rounded-3xl bg-white px-45 py-30"
		>
			<img class="w-28" src={UNLogo} alt="Logo of the United Nations in black and white" />
			<p
				class=" text-center font-[Montagu_Slab] text-[1.1rem]/6.5 font-thin tracking-tight text-(--off-black)"
			>
				Our research is fundamentally aligned with the UN Sustainable Development Goals (SDGs),
				specifically contributing to affordable and clean energy (SDG 7), good health and well-being
				(SDG 3), and sustainable industry and infrastructure (SDG 9). We strictly adhere to
				principles of Fairness, Accountability, Transparency, and Explainability (FATE) to ensure
				our solutions comply with the EU AI Act and OECD recommendations for trustworthy AI.
			</p>
		</div>
	</div>
</section>

<style>
	.section {
		display: flex;
		justify-content: space-between;
		margin-top: 3rem;
		color: var(--off-black);
	}
	.title-area {
		display: flex;
		margin-right: 2rem;
		margin-left: 1.2rem;
	}
</style>
