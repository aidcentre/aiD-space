<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';

	const { description }: { description: string } = $props();
</script>

<!-- xl: capped to a share of the viewport, and never wider than the gap left of the centred 700px search bar. -->
<div class="absolute bottom-4 left-4 right-4 max-w-250 xl:bottom-0 xl:max-w-[min(25vw,calc(50vw-350px-4rem))]">
	<h1 class="font-bold text-off-black text-md md:text-lg lg:text-xl xl:text-2xl leading-tight">
		<Scramble text={description} speed="fast" />
	</h1>
</div>
