<script lang="ts">
	import BackToAid from './BackToAid.svelte';
	import aiDLogo from '/src/lib/assets/aiD_logotype_white_RGB.svg';
	let { version, nodeNum } = $props();
</script>

<div
	class="sticky top-0 z-10 flex h-10 w-full items-center bg-off-black pt-4 pb-4 text-[0.875rem] text-light-grey"
>
	<div class="navbar-start overflow-hidden pl-3">
		<span class="max-sm:hidden">aiD v{version}</span>
		<img
			src={aiDLogo}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			class="h-[20px] sm:pl-40"
		/>
	</div>
	<div>
		<BackToAid />
	</div>
	<div class="node-text navbar-end pr-3">
		<div class="node-text">
			<div class="square"></div>
			<span>node 000{nodeNum}</span>
		</div>
	</div>
</div>

<style>
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
