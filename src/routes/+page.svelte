<script>
	import { SvelteFlow, Background, BackgroundVariant } from '@xyflow/svelte';
	import TextNode from '$lib/ui/TextNode.svelte';
	import ImageNode from '$lib/ui/ImageNode.svelte';
	import NavNode from '$lib/ui/NavNode.svelte';
	import SearchBar from '$lib/ui/SearchBar.svelte';
	import '@xyflow/svelte/dist/style.css';
	import Header from '$lib/ui/Header.svelte';

	let nodeTypes = {
		textNode: TextNode,
		imageNode: ImageNode,
		navNode: NavNode
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
			position: { x: 0, y: -100 }
		},
		{
			id: '2',
			draggable: false,
			data: { text: 'What is aiD?', pageName: 'about' },
			type: 'navNode',
			position: { x: 550, y: 420 }
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
			id: '4',
			draggable: false,
			data: { text: 'About & contact', pageName: 'contact' },
			type: 'navNode',
			position: { x: 1100, y: 380 }
		},
		{
			id: '5',
			width: 300,
			draggable: false,
			data: {
				text: "We're building something great here. Watch this space."
			},
			type: 'textNode',
			position: { x: 1000, y: 20 }
		}
	]);

	let halfvw = '50vw';
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
		translateExtent={[
			[-1000, -800],
			[2000, 1400]
		]}
	>
		<Background
			id="1"
			bgColor="var(--off-black)"
			patternColor="var(--dark-grey)"
			variant={BackgroundVariant.Dots}
			size={1.5}
			gap={20}
		/>
	</SvelteFlow>
</div>

<SearchBar />

<style>
	.sf-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
	}
</style>
