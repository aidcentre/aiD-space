<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	let milestones = [
		'400 MSc students educated',
		'30 PhDs/postdocs graduated',
		'50 Researchers strengthened'
	];
</script>

<section class="section">
	<div class="title-area">
		<Button
			label="Mission and Goals"
			section_id="mission-and-goals"
			section_ref="mission-and-goals"
		/>
	</div>
	<div class="section-content">
		<div>
			<p class="mb-14 w-3/5 font-[Montagu_Slab] text-[1.1rem]/6.5 font-thin tracking-tight">
				A core mission of AID is to develop the next generation of AI experts. We aim to educate 400
				MSc students and 30 PhDs/postdocs, while strengthening the expertise of over 50 existing
				researchers. By pairing academic researchers with professional partners, we ensure that our
				training is grounded in real-world industrial and societal needs.
			</p>
		</div>
		<div class="org-stats">
			<p class="text-[0.85rem] text-(--grey)">Key milestones</p>
			<div class="flex flex-row justify-between">
				{#each milestones as ms}
					<p class="mb-3 font-[Milling] text-xl font-extrabold">{ms}</p>
				{/each}
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
		margin-left: 1.2rem;
	}
	.org-stats {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;
	}
</style>
