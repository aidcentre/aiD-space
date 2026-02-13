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

<section class="section columns-2 gap-72">
	<div class="title-area">
		<a
			class="section-title flex w-max text-[0.8rem] font-bold drop-shadow-none"
			id="impact-and-use-cases"
			href="#impact-and-use-cases">Real-World Impact and Use Cases</a
		>
		<h6 class="mb-6 w-full text-lg font-extrabold text-white">
			<span
				>aiD demonstrates its research progress through more than 10 high-impact use cases organized
				into five topical areas and driven by industrial partners.</span
			>
		</h6>
	</div>
	<div class="section-content mt-24 w-2/3">
		{#each useCases as uc}
			<div>
				<p class="mb-4 font-[Milling] text-[0.8rem] font-extrabold tracking-wide">{uc.title}</p>
				<p class="mb-14 text-[1.1rem] tracking-tight">
					{uc.content}
				</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.section {
		display: flex;
		justify-content: space-between;
		background-color: var(--off-black);
		padding-right: 8rem;
		padding-top: 4rem;
		padding-bottom: 6rem;
		margin-top: 3rem;
		color: var(--off-black);
	}
	.title-area {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		margin-left: 1.2rem;
	}
	.section-content {
		color: var(--off-black);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6rem;
		font-family: 'Montagu Slab';
		font-weight: 400;
		line-height: 1.7rem;
		color: white;
	}
	.section-title {
		background: white;
		color: var(--off-black);
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
	}
</style>
