<script lang="ts">
	import './style.css';
	import favicon from '$lib/assets/favicon.png';
	import Meta from '$lib/meta/Meta.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Meta />

{@render children()}