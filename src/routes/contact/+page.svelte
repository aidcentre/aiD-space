<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	import ContactInfoHero from '$lib/contact/ContactInfoHero.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import PartnersFilterHero from '$lib/contact/PartnersFilterHero.svelte';
</script>

<svelte:head>
	<title>Contact | aiD</title>
</svelte:head>

<NavHeader version={0.1} nodeNum={4} />

<main class="flex flex-col gap-0">
	<ContactInfoHero />
	<div class="dot-bg mx-4 pt-7"></div>
	<PartnersFilterHero />
	<Footer />
</main>

<style>
	.dot-bg {
		background-image: url('/src/lib/assets/diagonal_squares_black.svg');
		background-repeat: repeat-x;
	}
</style>
