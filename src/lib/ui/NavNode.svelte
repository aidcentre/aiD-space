<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	let { id, width, draggable, data }: NodeProps = $props();
</script>

<div class="node">
	<div class="node-top">
		<div class="square"></div>
		<span class="node-title">NODE 000{id}</span>
	</div>
	<a href="/about" class="node-content btn" type="button"><span>{data.text}</span></a>
</div>

<style>
	.node {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 6px;
		overflow: hidden;
	}
	.node-top {
		color: var(--grey);
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
	.node-title {
		font-size: 0.6rem;
	}
	.node-content {
		background-color: var(--light-grey, #e8e8e8);
		color: var(--off-black, #050505);
		border-radius: 8px;
		padding: 1rem;
		justify-content: left;
		align-items: flex-end;
		font-size: 1rem;
		line-height: 1.5rem;
		width: 10rem;
		height: 8rem;
		overflow-wrap: break-word;
		word-break: break-word;
		overflow: hidden;
		transition-duration: 0.2s;
	}
	/* .node-content:hover {
		background-color: var(--light-grey, #e8e8e8);
		color: var(--off-black, #050505);
	} */
</style>
