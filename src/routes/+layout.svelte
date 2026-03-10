<script lang="ts">
	import './style.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main class="wrapper">
	{@render children()}
</main>

<style>
	:global(html) {
		background-color: var(--light-grey);
	}
	.wrapper {
		max-width: 1920px;
		margin: 0 auto;
	}

	/* css for background items that should not be constrained by 1920px wrapper */
	/* if using, set background color and use w-max-[1920px] in child element */
	:global(.viewport-width) {
		display: flex;
		justify-content: center;
		position: relative;
		right: 50%;
		left: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
		max-width: 100vw;
		width: 100vw;
	}
</style>
