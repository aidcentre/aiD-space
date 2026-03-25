<script lang="ts">
	import PartnerStats from './PartnerStats.svelte';
	import SectionLabel from '$lib/about/SectionLabel.svelte';
</script>

<section>
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-[1920px] px-4 mx-auto my-30 md:my-40 lg:my-60">
		<div class="col-span-2">
			<SectionLabel label="What is aiD?" />
		</div>
		<div class="col-span-10 flex flex-col gap-8 lg:gap-12 xl:gap-16">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
				<PartnerStats orgType="Academic Institutions" orgAmount="3" />
				<PartnerStats orgType="Research Organizations" orgAmount="6" />
				<PartnerStats orgType="Professional Organizations (POs)" orgAmount="50" />
			</div>
			<div class="md:columns-2 gap-4 md:gap-8 lg:gap-12">
				<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black mb-3 lg:mb-6">
					aiD is an interdisciplinary collaboration involving 3 academic institutions, 6 research
					organizations, and over 50 professional organizations (POs). The center is led by Director
					Prof. Sebastien Gros (NTNU) and Co-Director Dr. Signe Riemer-Sørensen (SINTEF Digital),
					supported by a management team with responsibility for fundamental research,
					operationalization, and innovation.
				</p>
				<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black mb-3 lg:mb-6">
					Our primary objective is to advance AI for decision-making through fundamental research
					and real-world use cases, ensuring that AI-enhanced human decisions or fully autonomous
					systems are effective, safe, and trustworthy in sectors critical to society.
				</p>
				<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black mb-3 lg:mb-6">
					aiD moves beyond traditional AI models that are purely descriptive. Instead, we employ a
					holistic framework where the primary learning objective is the decision outcome itself.
					This involves backpropagating learning through the entire decision process, from
					converting raw data into information to predicting how actions impact the real world while
					modeling risk and human preferences.
				</p>
				<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black mb-3 lg:mb-6">
					Our research addresses several critical challenges that currently limit AI adoption in
					professional organizations, including low trustworthiness, immature technology, and a
					shortage of expertise regarding emerging regulations.
				</p>
			</div>
		</div>
	</div>
</section>