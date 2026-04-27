<script lang="ts">
	import UNLogo from '$lib/assets/UN_logo_bw.svg';
	import SectionLabel from './SectionLabel.svelte';
</script>

<section>
	<div class="grid grid-cols-12 gap-8 lg:gap-12 max-w-[1920px] px-4 mx-auto my-30 md:my-40 lg:my-60">
		<div class="col-span-12 lg:col-span-2">
			<SectionLabel 
				label="Sustainablity"
				class="text-off-black dark:text-white transition-colors duration-800 ease-out-expo"
			/>
		</div>
		<div class="col-span-12 lg:col-span-10 xl:col-span-9">
			<div class="flex flex-col items-center justify-center rounded-4xl py-12 md:py-16 lg:py-20 xl:py-24 px-8 md:px-20 lg:px-32 xl:px-40 gap-8 lg:gap-12 bg-white dark:bg-darker-grey transition-colors duration-800 ease-out-expo">
				<img src={UNLogo} alt="Logo of the United Nations in black and white" class="w-24 md:w-32 select-none" />
				<p class="text-sm md:text-md lg:text-lg font-family-serif text-center text-off-black dark:text-white transition-colors duration-800 ease-out-expo">
					Our research is fundamentally aligned with the UN Sustainable Development Goals (SDGs),
					specifically contributing to affordable and clean energy (SDG 7), good health and well-being
					(SDG 3), and sustainable industry and infrastructure (SDG 9). We strictly adhere to
					principles of Fairness, Accountability, Transparency, and Explainability (FATE) to ensure
					our solutions comply with the EU AI Act and OECD recommendations for trustworthy AI.
				</p>
			</div>
		</div>
	</div>
</section>