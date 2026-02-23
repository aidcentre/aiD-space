<script lang="ts">
	import aiDLogo from '/src/lib/assets/aiD_lockup_black_RGB.svg';
</script>

<div class="navbar items-start pt-4" style:color="var(--light-grey)">
	<div class="navbar-start pl-3 text-xs">
		<!-- TODO: consider using <object> instead for accessibility -->

		<img
			src={aiDLogo}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			width="200rem"
			height="200rem"
		/>
	</div>
	<div class="pointer-events-auto mr-2 navbar-end gap-2 text-xs">
		<a class="section-title drop-shadow-none" href="/about">What is aiD</a>
		<a class="section-title drop-shadow-none" href="/contact">Contact</a>
	</div>
</div>

<style>
	.section-title {
		display: inline-flex;
		background: white;
		color: var(--off-black);
		border-radius: 0.4rem;
		padding: 0.5rem 1rem;
		font-weight: 800;
		font-size: 0.8rem;
		width: max-content;
	}
</style>
