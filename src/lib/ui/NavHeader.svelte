<script lang="ts">
	import aiDLogo from '/src/lib/assets/aiD_logotype_white_RGB.svg';
	let { version, nodeNum } = $props();
</script>

<div class="header-main sticky top-0 items-start pt-4 pb-4 text-xs shadow-sm">
	<div class="navbar-start overflow-hidden pl-3">
		<span>aiD v{version}</span>
		<img
			src={aiDLogo}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			class="max-h-[20px] pl-40"
		/>
	</div>
	<a href="/" class="navbar-center" style:gap="0.5rem">
		<div class="back-arrow">←</div>
		<span>Back to aiD</span>
	</a>
	<div class="node-text navbar-end pr-3">
		<div class="node-text">
			<div class="square"></div>
			<span>node 000{nodeNum}</span>
		</div>
	</div>
</div>

<style>
	.header-main {
		display: flex;
		width: 100%;
		align-items: center;
		padding: 0.5rem;
		color: var(--light-grey);
		background-color: var(--off-black);
		height: fit-content;
		z-index: 10;
	}
	.back-arrow {
		display: flex;
		padding: 0.25rem;
		line-height: 0.75rem;
		justify-content: center;
		align-items: center;
		border-radius: 0.25rem;
		border: 1px solid var(--light-grey, #e8e8e8);
	}
	.node-text {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.square {
		height: 0.6rem;
		width: 0.6rem;
		background-color: var(--light-grey);
		border-radius: 2px;
	}
</style>
