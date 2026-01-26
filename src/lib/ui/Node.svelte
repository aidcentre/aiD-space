<script lang="ts">
	import '../../routes/layout.css';
	let { nodeText, nodeNum, leftPos, topPos, nodeWidth } = $props();
</script>

<div class="node" style:left={leftPos} style:top={topPos} style:width={nodeWidth}>
	<div class="node-top">
		<div class="square"></div>
		<span class="node-title">NODE 000{nodeNum}</span>
	</div>
	<span class="node-text">{nodeText}</span>
</div>

<style>
	.node {
		display: flex;
		position: absolute;
		padding: 1.5%;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 2px;
		border-radius: 8px;
		border: 1px solid rgba(63, 63, 63, 0.5);
		background: #050505;
		color: antiquewhite;
		font-family: 'Milling';
	}
	.node-top {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.square {
		height: 0.4rem;
		width: 0.4rem;
		background-color: #e8e8e8;
		border-radius: 2px;
	}
	.node-title {
		color: #969696;
		font-size: 0.4rem;
	}
	.node-text {
		align-self: stretch;
		color: #e8e8e8;
		font-size: 0.7rem;
		line-height: 1rem; /* 125% */
	}
</style>
