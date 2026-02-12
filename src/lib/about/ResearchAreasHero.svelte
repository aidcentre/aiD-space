<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
</script>

<section class="section">
	<div class="title-area">
		<Button label="Research Areas" section_id="research-areas" section_ref="research-areas" />
	</div>
	<div class="section-content">
		<div class="org-stats text-4xl font-extrabold">
			<span>To achieve its goals, aiD operates across nine specialized Research Areas (RAs):</span>
		</div>
		<div class="paragraph-area columns-2 gap-16">
			<div></div>
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
		width: 100%;
	}
</style>
