<script lang="ts">
	import roundsquareFrame from '$lib/assets/roundsquare_frame.svg';
	import Scramble from '$lib/actions/Scramble.svelte';

	let { orgType, orgAmount } = $props();
</script>

<div class="flex items-center gap-[1rem] sm:gap-8">
	<div class="relative">
		<img
			src={roundsquareFrame}
			alt="square dotted frame surrounding the number of ${orgType}"
			class="size-10 min-w-fit sm:size-20 sm:min-w-fit"
		/>
		<span
			class="amount text-[1rem] leading-4 font-bold text-off-black sm:text-[1.5rem] sm:leading-8"
			>{orgAmount}</span
		>
	</div>
	<Scramble
		class="org-type flex items-center text-[1.25rem] leading-8 font-bold sm:text-[1.5rem]"
		text={orgType}
	/>
</div>

<style>
	.amount {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.dotted-box {
		height: 4rem;
		min-width: fit-content;
	}
</style>
