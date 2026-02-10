<script lang="ts">
	let sectionTitle = 'What is aiD?';
	import PartnerStats from './PartnerStats.svelte';
</script>

<section class="section">
	<div class="title-area">
		<a class="section-title btn" id="what-is-aid" href="#what-is-aid">{sectionTitle}</a>
	</div>
	<div class="section-content">
		<div class="org-stats">
			<PartnerStats orgType="Academic Institutions" orgAmount="3" />
			<PartnerStats orgType="Research Organizations" orgAmount="6" />
			<PartnerStats orgType="Professional Organizations (POs)" orgAmount="50" />
		</div>
		<div class="paragraph-area columns-2 gap-16">
			<div>
				<p class="mb-4">
					aiD is an interdisciplinary collaboration involving 3 academic institutions, 6 research
					organizations, and over 50 professional organizations (POs). The center is led by Director
					Prof. Sebastien Gros (NTNU) and Co-Director Dr. Signe Riemer-Sørensen (SINTEF Digital),
					supported by a management team with responsibility for fundamental research,
					operationalization, and innovation.
				</p>
				<p>
					Our primary objective is to advance AI for decision-making through fundamental research
					and real-world use cases, ensuring that AI-enhanced human decisions or fully autonomous
					systems are effective, safe, and trustworthy in sectors critical to society.
				</p>
			</div>
			<div>
				<p class="mb-4">
					aiD moves beyond traditional AI models that are purely descriptive. Instead, we employ a
					holistic framework where the primary learning objective is the decision outcome itself.
					This involves backpropagating learning through the entire decision process, from
					converting raw data into information to predicting how actions impact the real world while
					modeling risk and human preferences.
				</p>
				<p>
					Our research addresses several critical challenges that currently limit AI adoption in
					professional organizations, including low trustworthiness, immature technology, and a
					shortage of expertise regarding emerging regulations.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.section {
		display: flex;
		justify-content: space-between;
		margin-right: 3rem;
		margin-top: 3rem;
		gap: 10rem;
		color: var(--off-black);
	}
	.section-title {
		background: var(--off-black);
		color: var(--light-grey);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.8rem;
	}
	.section-content {
		color: var(--off-black);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 3rem;
	}
	.title-area {
		display: flex;
		width: 40vw;
		padding-left: 2rem;
	}
	.paragraph-area {
		font-family: 'Montagu Slab';
		font-weight: '400';
		line-height: '1.6rem';
		letter-spacing: '-0.02rem';
	}
	.org-stats {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 4rem;
	}
</style>
