<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';
	import SectionLabel from './SectionLabel.svelte';

	let milestones = [
		'400 MSc students educated',
		'30 PhDs/postdocs graduated',
		'50 Researchers strengthened'
	];
</script>

<section>
	<div class="grid grid-cols-12 gap-8 lg:gap-12 max-w-[1920px] px-4 mx-auto my-30 md:my-40 lg:my-60">
		<div class="col-span-12 lg:col-span-2">
			<SectionLabel 
				label="Mission and Goals" 
				class="text-off-black dark:text-white transition-colors duration-800 ease-out-expo"
			/>
		</div>
		<div class="col-span-12 lg:col-span-10 xl:col-span-9">
			<div class="flex flex-col gap-8 lg:gap-12 xl:gap-16">
			<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black dark:text-white transition-colors duration-800 ease-out-expo">A core mission of AID is to develop the next generation of AI experts. We aim to educate 400 MSc students and 30 PhDs/postdocs, while strengthening the expertise of over 50 existing researchers. By pairing academic researchers with professional partners, we ensure that our training is grounded in real-world industrial and societal needs.</p>
			<div class="flex flex-col gap-4">
				<div class="text-sm lg:text-md font-bold text-greyed-out">Key milestones</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 lg:gap-8">
						{#each milestones as item}
							<div class="flex gap-2 md:gap-3">
								<div class="w-3.75 h-3.75 md:w-4.5 md:h-4.5 aspect-square rounded translate-y-1 md:translate-y-1.25 bg-off-black"></div>
								<Scramble 
									text={item} 
									speed="slow"
									class="text-md md:text-lg lg:text-xl font-bold text-off-black dark:text-white transition-colors duration-800 ease-out-expo" 
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
