<script lang="ts">
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import ContactHero from '$lib/contact/ContactHero.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import PartnersFilterHero from '$lib/contact/PartnersFilterHero.svelte';
	import Management from '$lib/contact/Management.svelte';
</script>

<Header />
<Menu />

<main>
	<ContactHero />
	<Management />
	<PartnersFilterHero />
</main>

<Footer />