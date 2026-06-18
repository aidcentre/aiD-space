<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';
	import PageBlocks from '$lib/blocks/PageBlocks.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const pageDoc = $derived(data.page);
</script>

<Header />
<Menu />

<main>
	{#if pageDoc?.introduction}
		<section>
			<div class="pt-45 md:pt-55 lg:pt-75 mb-30 md:mb-40 lg:mb-60 mx-auto max-w-[1920px] px-4">
				<Scramble
					text={pageDoc.introduction}
					speed="fast"
					class="font-bold text-off-black w-full md:w-150 lg:w-200 xl:w-270 text-xl lg:text-2xl leading-tight"
				/>
			</div>
		</section>
	{/if}
	{#if pageDoc?.contentBlocks?.length}
		<PageBlocks blocks={pageDoc.contentBlocks} />
	{/if}
</main>

<Footer />
