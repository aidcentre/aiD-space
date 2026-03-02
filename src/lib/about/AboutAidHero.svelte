<script lang="ts">
	import PartnerStats from './PartnerStats.svelte';
	import Button from '$lib/ui/Button.svelte';
	import SectionLabel from '$lib/about/SectionLabel.svelte';
</script>

<section class="flex flex-col px-4 text-off-black sm:flex-row sm:gap-20">
	<div class="mb-4 ml-[1.2rem] flex">
		<SectionLabel label="What is aiD?" />
	</div>
	<div class="section-content">
		<div class="flex w-full flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-6">
			<PartnerStats orgType="Academic Institutions" orgAmount="3" />
			<PartnerStats orgType="Research Organizations" orgAmount="6" />
			<PartnerStats orgType="Professional Organizations (POs)" orgAmount="50" />
		</div>
		<div class="paragraph-area columns-2 gap-16">
			<p class="mb-4">
				aiD is an interdisciplinary collaboration involving 3 academic institutions, 6 research
				organizations, and over 50 professional organizations (POs). The center is led by Director
				Prof. Sebastien Gros (NTNU) and Co-Director Dr. Signe Riemer-Sørensen (SINTEF Digital),
				supported by a management team with responsibility for fundamental research,
				operationalization, and innovation.
			</p>
			<p class="mb-4">
				Our primary objective is to advance AI for decision-making through fundamental research and
				real-world use cases, ensuring that AI-enhanced human decisions or fully autonomous systems
				are effective, safe, and trustworthy in sectors critical to society.
			</p>
			<p class="mb-4">
				aiD moves beyond traditional AI models that are purely descriptive. Instead, we employ a
				holistic framework where the primary learning objective is the decision outcome itself. This
				involves backpropagating learning through the entire decision process, from converting raw
				data into information to predicting how actions impact the real world while modeling risk
				and human preferences.
			</p>
			<p>
				Our research addresses several critical challenges that currently limit AI adoption in
				professional organizations, including low trustworthiness, immature technology, and a
				shortage of expertise regarding emerging regulations.
			</p>
		</div>
	</div>
</section>

<style>
	.section-content {
		color: var(--off-black);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
	}
	.paragraph-area {
		font-family: 'Montagu Slab';
		font-size: 1.1rem;
		font-weight: 400;
		line-height: 1.6rem;
		letter-spacing: -0.02rem;
	}
</style>
