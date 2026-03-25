<script lang="ts">
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import ContactInfoHero from '$lib/contact/ContactInfoHero.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import PartnersFilterHero from '$lib/contact/PartnersFilterHero.svelte';
	import Management from '$lib/contact/Management.svelte';
</script>

<Header />
<Menu />

<main>
	<ContactInfoHero />
	<Management />
	<PartnersFilterHero />
</main>

<Footer />