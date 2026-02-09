<script lang="ts">
	import NavHeader from '$lib/ui/NavHeader.svelte';
	import WhatIsAid from '$lib/about/AboutAidHero.svelte';
	import Tornado from '$lib/ui/Tornado.svelte';
</script>

<NavHeader version={0.1} nodeNum={2} />

<main>
	<Tornado />
	<WhatIsAid />
</main>

<style>
</style>
