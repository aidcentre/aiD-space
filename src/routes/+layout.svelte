<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/aiD_profile_picture_black.png';
	import Header from '$lib/ui/Header.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header lastCommit="2 days" author="CamillaS" />

{@render children()}
