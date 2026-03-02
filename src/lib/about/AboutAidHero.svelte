<script lang="ts">
	import PartnerStats from './PartnerStats.svelte';
	import SectionLabel from '$lib/about/SectionLabel.svelte';
</script>

<section class="grid grid-cols-1 gap-10 px-6 text-off-black xl:grid-cols-[1fr_5fr] xl:gap-0">
	<SectionLabel label="What is aiD?" />
	<div class="flex flex-col items-center gap-10 lg:gap-[4rem]">
		<div class="flex w-full flex-col flex-wrap gap-4 sm:grid sm:grid-cols-3 sm:gap-6">
			<PartnerStats orgType="Academic Institutions" orgAmount="3" />
			<PartnerStats orgType="Research Organizations" orgAmount="6" />
			<PartnerStats orgType="Professional Organizations (POs)" orgAmount="50" />
		</div>
		<div
			class="font-normAL font-[Montagu_Slab] text-[1rem] leading-6 lg:columns-2 lg:gap-16 lg:text-[1.44rem] lg:leading-[2rem]"
		>
			<p class="mb-[2rem]">
				aiD is an interdisciplinary collaboration involving 3 academic institutions, 6 research
				organizations, and over 50 professional organizations (POs). The center is led by Director
				Prof. Sebastien Gros (NTNU) and Co-Director Dr. Signe Riemer-Sørensen (SINTEF Digital),
				supported by a management team with responsibility for fundamental research,
				operationalization, and innovation.
			</p>
			<p class="mb-[2rem]">
				Our primary objective is to advance AI for decision-making through fundamental research and
				real-world use cases, ensuring that AI-enhanced human decisions or fully autonomous systems
				are effective, safe, and trustworthy in sectors critical to society.
			</p>
			<p class="mb-[2rem]">
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
