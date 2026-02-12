<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	let researchAreas = [
		{
			title: 'Trust',
			content:
				'Developing frameworks for safe, responsible AI and robust system verification, assurance and compliance.'
		},
		{
			title: 'Knowledge-Embedding',
			content:
				'Integrating physical laws, simulations, and domain expertise into AI via Scientific Machine Learning (SciML) to ensure reliability even with scarce data. Machine-learning driven causal inference in decision processes. '
		},
		{
			title: 'Training',
			content:
				'Creating novel loss functions and training methods tailored to decision objectives like safety and utility rather than generic accuracy.'
		},
		{
			title: 'Human-AI Interaction',
			content:
				"Designing interfaces that combine AI's speed with human intuition, ensuring operators can trust and understand AI-supported decisions."
		},
		{
			title: 'Disruptive',
			content: 'Monitor other technologies that will influence AI and adapt to the development.'
		},
		{
			title: 'Barriers',
			content:
				'Solutions for technological and organisational barriers for AI in decisions processes.'
		},
		{
			title: 'Data to Information',
			content:
				'Finding optimal latent data representations with maximum decision relevant information.'
		},
		{
			title: 'Generalization and Uncertainty',
			content:
				'Managing how AI models extrapolate beyond their training data to prevent unsafe decisions in uncertain environments.'
		},
		{
			title: 'Multi-Agents',
			content:
				'Developing fair and transparent frameworks for scenarios where multiple AI or human agents share resources or have competing objectives.'
		}
	];
</script>

<section class="section">
	<div class="title-area">
		<Button label="Research Areas" section_id="research-areas" section_ref="research-areas" />
	</div>
	<div class="section-content">
		<h2 class="w-full text-4xl font-extrabold">
			<span>To achieve its goals, aiD operates across nine specialized Research Areas (RAs):</span>
		</h2>
		<div class="paragraph-area columns-2 gap-40">
			{#each researchAreas as area}
				<div class="break-inside-avoid">
					<p class="mb-3 font-[Milling] text-xl font-extrabold">{area.title}</p>
					<p class="mb-12 text-[1.1rem]">{area.content}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.section {
		display: flex;
		justify-content: space-between;
		margin-right: 3rem;
		margin-top: 3rem;
		color: var(--off-black);
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
		margin-right: 10rem;
		margin-left: 2rem;
	}
	.paragraph-area {
		font-family: 'Montagu Slab';
		font-weight: 400;
		line-height: 1.7rem;
		letter-spacing: -0.02rem;
	}
</style>
