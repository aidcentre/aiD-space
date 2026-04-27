<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import aid_img from '../assets/aiD_website_image.jpg';
	let { id, width, draggable, data }: NodeProps = $props();
</script>

<!-- TODO: for accessibility, make button instead of div. this is a workaround -->
<div class="node" role="button" tabindex="0">
	<div class="node-top">
		<div class="squircle"></div>
		<span class="node-title">NODE 000{id}</span>
		<span class="node-title">{data.fileName}.jpg</span>
	</div>
	<img
		class="node-img"
		src={aid_img}
		alt="Swirling white flakes with the AID centre logo in the middle"
	/>
</div>

<style>
	.node {
		display: flex;
		padding: 1.6rem;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 4px;
		border-radius: 8px;
		color: var(--light-grey);
		cursor: pointer;
		overflow: hidden;
	}
	.node-top {
		color: var(--grey);
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.squircle {
		height: 0.6rem;
		width: 0.6rem;
		background-color: var(--light-grey);
		border-radius: 2px;
	}
	.node-title {
		font-size: 0.6rem;
	}
	.node-img {
		width: 14rem;
	}
</style>
