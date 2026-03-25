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

<section>
	<div class="grid grid-cols-12 gap-8 lg:gap-12 max-w-[1920px] px-4 mx-auto my-30 md:my-40 lg:my-60">
		<div class="col-span-12 lg:col-span-2">
			<SectionLabel 
				label="Research areas"
				class="text-off-black dark:text-white transition-colors duration-800 ease-out-expo" 
			/>
		</div>
		<div class="col-span-12 lg:col-span-10">
			<div class="flex flex-col gap-8 lg:gap-12 xl:gap-16">
				<h2 class="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight text-off-black dark:text-white transition-colors duration-800 ease-out-expo">To achieve its goals, aiD operates across nine specialized Research Areas (RAs):</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 lg:gap-x-12 gap-y-6 lg:gap-y-8">
					{#each researchAreas as area}
						<div class="flex flex-col gap-2 md:gap-4">
							<h3 class="text-md md:text-lg lg:text-xl font-bold text-off-black dark:text-white transition-colors duration-800 ease-out-expo">{area.title}</h3>
							<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black dark:text-white transition-colors duration-800 ease-out-expo">{area.content}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
