<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	import ContactInfoHero from '$lib/contact/ContactInfoHero.svelte';
</script>

<NavHeader version={0.1} nodeNum={4} />

<main class="mx-4 flex flex-col gap-24">
	<ContactInfoHero />
	<div class="dot-bg pt-8"></div>
</main>

<style>
	.dot-bg {
		background-image: url('/src/lib/assets/diagonal_squares_black.svg');
		background-repeat: repeat-x;
	}
</style>
