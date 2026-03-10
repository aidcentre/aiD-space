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

<div class="viewport-width bg-off-black">
	<section class="grid max-w-[1920px] grid-cols-1 gap-0 px-4 pt-16 pb-44 text-off-black">
		<!-- sticky part for large screen sizes -->
		<div class="sticky top-10 grid grid-cols-2 grid-rows-[auto_auto_auto] gap-0 max-xl:hidden">
			<div class="dot-bg col-span-2 mb-[3.5rem] bg-off-black pt-8"></div>
			<div
				class="col-start-1 col-end-2 mb-10 flex size-fit items-center rounded-[8px] bg-white px-4 py-3 leading-[1.5rem] font-bold text-nowrap text-off-black xl:text-[1rem] xl:leading-[1.1rem]"
			>
				Real-World Impact and Use Cases
			</div>
			<div
				class="col-start-2 col-end-3 row-start-2 row-end-4 -mt-[3.5rem] h-[6rem] w-full bg-linear-to-b from-black to-transparent"
			></div>
			<p
				class="col-start-1 col-end-2 w-4/5 text-[1.25rem] leading-[1.625rem] font-semibold text-white sm:text-[1.5rem] sm:leading-[2rem] sm:font-bold"
			>
				aiD demonstrates its research progress through more than 10 high-impact use cases organized
				into five topical areas and driven by industrial partners:
			</p>
		</div>
		<!-- hide sticky part for small screen sizes -->
		<div class="sticky top-12 flex flex-col gap-0 xl:hidden">
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
					aiD demonstrates its research progress through more than 10 high-impact use cases
					organized into five topical areas and driven by industrial partners:
				</h6>
			</div>
			<div
				class="row-start-4 row-end-5 h-[8rem] w-full bg-linear-to-b from-black to-transparent"
			></div>
		</div>
		<!-- list of use cases -->
		<div
			class="grid grid-cols-1 gap-60 lg:max-xl:px-[18rem] xl:-mt-[7rem] xl:grid-cols-2 xl:gap-x-[8rem]"
		>
			<div class="grid gap-y-60 xl:col-start-2 xl:col-end-3 xl:grid-cols-subgrid xl:px-[9rem]">
				{#each useCases as uc}
					<div>
						<p
							class="mb-[0.75rem] font-[Milling] text-[1rem] leading-[1.5rem] font-bold text-white"
						>
							{uc.title}
						</p>

						<p
							class="font-[Montagu_Slab] text-[1rem] leading-[1.5rem] leading-[2rem] tracking-tight text-white xl:text-[1.44rem]"
						>
							{uc.content}
						</p>
					</div>
				{/each}s
			</div>
		</div>
	</section>
</div>

<style>
	.dot-bg {
		background-image: url('/src/lib/assets/diagonal_squares_white.svg');
		background-repeat: repeat-x;
		background-size: auto;
	}
</style>
