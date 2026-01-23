<script>
	import { SvelteFlow, Background, BackgroundVariant } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
</script>

<svelte:head>
	<title>AID Home</title>
</svelte:head>

<div style:width="100vw" style:height="100vh">
	<SvelteFlow maxZoom={1} minZoom={1}>
		<!-- can add patternClass -->
		<Background
			bgColor="#0A0A0A"
			patternColor="#d9d9d9"
			variant={BackgroundVariant.Cross}
			gap={40}
		/>
	</SvelteFlow>
</div>
