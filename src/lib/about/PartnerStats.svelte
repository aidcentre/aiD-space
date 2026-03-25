<script lang="ts">
	import roundsquareFrame from '$lib/assets/roundsquare_frame.svg';
	import Scramble from '$lib/actions/Scramble.svelte';

	let { orgType, orgAmount } = $props();
</script>

<div class="flex items-center gap-3 md:gap-6 lg:gap-9">
	<div class="relative size-10 md:size-12 lg:size-16 min-w-fit">
		<img
			src={roundsquareFrame}
			alt="square dotted frame surrounding the number of ${orgType}"
			class="w-full h-full"
		/>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-off-black text-md md:text-lg lg:text-xl">{orgAmount}</div
		>
	</div>
	<div class="flex items-center">
		<Scramble text={orgType} speed="slow" class="text-md md:text-lg lg:text-xl font-bold text-off-black" />
	</div>
</div>