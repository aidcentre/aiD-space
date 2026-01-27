<script lang="ts">
	import '../../routes/layout.css';
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { onMount } from 'svelte';
	gsap.registerPlugin(ScrambleTextPlugin);

	let { nodeText, nodeNum, leftPos, topPos, nodeWidth } = $props();

	let textEl: HTMLSpanElement;

	function runScramble() {
		if (!textEl) return;

		gsap.killTweensOf(textEl); // prevents animation from running over itself

		gsap.fromTo(
			textEl,
			{ scrambleText: { text: '', chars: '01!@#$%^&*', speed: 0.8 } },
			{
				scrambleText: { text: nodeText, chars: '01!@#$%^&*', speed: 0.8 },
				duration: 1.2,
				ease: 'power2.out'
			}
		);
	}

	onMount(() => {
		runScramble();
	});
</script>

<!-- TODO: for accessibility, make button instead of div. this is a workaround -->
<div
	class="node"
	onclick={runScramble}
	onkeydown={runScramble}
	style:left={leftPos}
	style:top={topPos}
	style:width={nodeWidth}
	tabindex="0"
	role="button"
>
	<div class="node-top">
		<div class="square"></div>
		<span class="node-title">NODE 000{nodeNum}</span>
	</div>
	<span class="node-text" bind:this={textEl}>{nodeText}</span>
</div>

<style>
	.node {
		display: flex;
		position: absolute;
		padding: 1.5%;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 4px;
		border-radius: 8px;
		border: 1px solid rgba(63, 63, 63, 0.5);
		background: #050505;
		color: antiquewhite;
		font-family: 'Milling';
		cursor: pointer;
		overflow: hidden;
	}
	.node-top {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.square {
		height: 0.6rem;
		width: 0.6rem;
		background-color: #e8e8e8;
		border-radius: 2px;
	}
	.node-title {
		color: #969696;
		font-size: 0.6rem;
	}
	.node-text {
		color: #e8e8e8;
		font-size: 1.2rem;
		line-height: 1.5rem;
		overflow-wrap: break-word;
		word-break: break-word;
		overflow: hidden;
	}
</style>
