<script>
	import { SvelteFlow, Background, BackgroundVariant } from '@xyflow/svelte';
	import TextNode from '$lib/ui/TextNode.svelte';
	import Header from '$lib/ui/Header.svelte';
	import '@xyflow/svelte/dist/style.css';
	import ImgNode from '$lib/ui/imgNode.svelte';

	let nodeTypes = {
		textNode: TextNode,
		imageNode: ImgNode
	};

	let nodes = $state.raw([
		{
			id: '1',
			width: 400,
			draggable: false,
			data: {
				text: 'aiD is building a scientific and technological foundation that makes reliable, real-world AI possible.'
			},
			type: 'textNode',
			position: { x: 0, y: 0 }
		},
		{
			id: '3',
			width: 400,
			draggable: false,
			data: {
				text: 'THIS IS AN IMAGE NODE!',
				fileName: 'image'
			},
			type: 'imageNode',
			position: { x: 0, y: 300 }
		},
		{
			id: '5',
			width: 300,
			draggable: false,
			data: { text: "We're building something great here. Watch this space." },
			type: 'textNode',
			position: { x: 900, y: 20 }
		}
	]);
</script>

<svelte:head>
	<title>AID Home</title>
</svelte:head>

<Header lastCommit="2 days" author="CamillaS" />

<div class="sf-bg">
	<SvelteFlow
		bind:nodes
		{nodeTypes}
		minZoom={1}
		maxZoom={1}
		fitView
		proOptions={{ hideAttribution: true }}
	>
		<Background
			id="1"
			bgColor="#050505"
			patternColor="#3F3F3F"
			variant={BackgroundVariant.Dots}
			size={1.5}
			gap={20}
		/>
	</SvelteFlow>
</div>

<style>
	.sf-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
	}
</style>
