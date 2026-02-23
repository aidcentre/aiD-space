<script lang="ts">
	import './style.css';
	import favicon from '$lib/assets/aiD_profile_picture_black.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main class="page-layout">
	{@render children()}
</main>

<style>
	:global(html) {
		background-color: var(--light-grey);
	}
	.page-layout {
		max-width: 1920px;
		margin: 0 auto;
	}
</style>
