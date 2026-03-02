<script lang="ts">
	import SectionLabel from './SectionLabel.svelte';

	let researchAreas = [
		{
			title: 'Trust',
			content:
				'Developing frameworks for safe, responsible AI and robust system verification, assurance and compliance.'
		},
		{
			title: 'Barriers',
			content:
				'Solutions for technological and organisational barriers for AI in decisions processes.'
		},
		{
			title: 'Knowledge-Embedding',
			content:
				'Integrating physical laws, simulations, and domain expertise into AI via Scientific Machine Learning (SciML) to ensure reliability even with scarce data. Machine-learning driven causal inference in decision processes. '
		},
		{
			title: 'Data to Information',
			content:
				'Finding optimal latent data representations with maximum decision relevant information.'
		},
		{
			title: 'Training',
			content:
				'Creating novel loss functions and training methods tailored to decision objectives like safety and utility rather than generic accuracy.'
		},
		{
			title: 'Generalization and Uncertainty',
			content:
				'Managing how AI models extrapolate beyond their training data to prevent unsafe decisions in uncertain environments.'
		},
		{
			title: 'Human-AI Interaction',
			content:
				"Designing interfaces that combine AI's speed with human intuition, ensuring operators can trust and understand AI-supported decisions."
		},

		{
			title: 'Multi-Agents',
			content:
				'Developing fair and transparent frameworks for scenarios where multiple AI or human agents share resources or have competing objectives.'
		},
		{
			title: 'Disruptive',
			content: 'Monitor other technologies that will influence AI and adapt to the development.'
		}
	];
</script>

<section class="grid grid-cols-1 gap-10 px-6 text-off-black xl:grid-cols-[1fr_5fr] xl:gap-0">
	<SectionLabel label="Research areas" />
	<div class="flex flex-col gap-10 sm:grid sm:grid-cols-2 sm:gap-20">
		<h2
			class="col-span-2 text-[1.5rem] leading-[2rem] font-extrabold lg:text-[3rem] lg:leading-[4rem]"
		>
			To achieve its goals, aiD operates across nine specialized Research Areas (RAs):
		</h2>

		{#each researchAreas as area}
			<div class="break-inside-avoid">
				<p
					class="mb-3.5 font-[Milling] text-[1rem] leading-[1.5rem] font-bold lg:text-[1.5rem] lg:leading-[2rem]"
				>
					{area.title}
				</p>
				<p
					class="font-[Montagu_Slab] text-[1rem] leading-[1.5rem] font-normal lg:text-[1.44rem] lg:leading-[2rem]"
				>
					{area.content}
				</p>
			</div>
		{/each}
	</div>
</section>
