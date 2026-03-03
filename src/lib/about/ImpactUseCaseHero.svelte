<script lang="ts">
	let useCases = [
		{
			title: 'Risk-based maintenance',
			content:
				'Predicting failures and recommending actions for wind turbines, power grids, ships, and buildings.'
		},
		{
			title: 'Autonomy',
			content:
				'Removing humans from repetitive or dangerous processes in maritime navigation and process control.'
		},
		{
			title: 'Resource and Asset Optimization',
			content:
				'Improving patient treatment pathways in healthcare and energy management in large building portfolios.'
		},
		{
			title: 'Operations Advancement',
			content:
				'Enhancing product quality and streamlining business operations in the process and maritime industries.'
		},
		{
			title: 'Logistics and Supply',
			content: 'Optimizing delivery management, passenger transportation, and road maintenance.'
		}
	];
</script>

<section
	class="grid grid-cols-1 gap-20 bg-off-black px-4 py-16 text-off-black xl:grid-cols-[1fr_5fr] xl:gap-0"
>
	<div class="sticky top-12 flex flex-col gap-0">
		<div class="flex flex-col gap-10 bg-off-black">
			<div class="dot-bg row-start-1 row-end-2 pt-8"></div>
			<div
				class="row-start-2 row-end-3 flex size-fit items-center rounded-[8px] bg-white px-4 py-3 leading-[1.5rem] font-bold text-nowrap text-off-black xl:text-[1rem] xl:leading-[1.1rem]"
			>
				Real-World Impact and Use Cases
			</div>
			<h6
				class="row-start-3 row-end-4 w-full text-[1.25rem] leading-[1.625rem] font-semibold text-white sm:text-[1.5rem] sm:leading-[2rem] sm:font-bold"
			>
				aiD demonstrates its research progress through more than 10 high-impact use cases organized
				into five topical areas and driven by industrial partners:
			</h6>
		</div>
		<div
			class="row-start-4 row-end-5 h-[8rem] w-full bg-linear-to-b from-black to-transparent"
		></div>
	</div>
	<div class="grid grid-cols-1 gap-60">
		{#each useCases as uc}
			<div>
				<p class="mb-[0.75rem] font-[Milling] text-[1rem] leading-[1.5rem] font-bold text-white">
					{uc.title}
				</p>

				<p class="font-[Montagu_Slab] text-[1rem] leading-[1.5rem] tracking-tight text-white">
					{uc.content}
				</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.dot-bg {
		background-image: url('/src/lib/assets/diagonal_squares_white.svg');
		background-repeat: repeat-x;
		background-size: auto;
	}
</style>
