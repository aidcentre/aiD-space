<script lang="ts">
	import roundsquareFrame from '$lib/assets/roundsquare_frame.svg';
	import Scramble from '$lib/actions/Scramble.svelte';

	let { orgType, orgAmount } = $props();
</script>

<div class="flex items-center gap-[1rem] xl:gap-8">
	<div class="relative">
		<img
			src={roundsquareFrame}
			alt="square dotted frame surrounding the number of ${orgType}"
			class="size-10 min-w-fit xl:size-20 xl:min-w-fit"
		/>
		<span
			class="amount text-[1rem] leading-4 font-bold text-off-black xl:text-[1.5rem] xl:leading-8"
			>{orgAmount}</span
		>
	</div>
	<div class="flex items-center">
		<Scramble text={orgType} class="org-type text-[1.25rem] leading-8 font-bold xl:text-[1.5rem]" />
	</div>
</div>

<style>
	.amount {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
