<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/aiD_profile_picture_black.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
