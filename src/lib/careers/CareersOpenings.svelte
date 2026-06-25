<script lang="ts">
	import type { Opening } from '$lib/sanity/types';
	import CareersCard from './CareersCard.svelte';

	let { openings = [] }: { openings?: Opening[] } = $props();
</script>

{#if openings.length}
	<div class="flex flex-col gap-3">
		{#each openings as opening (opening._id)}
			<CareersCard {opening} />
		{/each}
	</div>
{:else}
	<div class="flex flex-col rounded-xl bg-white p-4 md:p-5 lg:p-6">
		<div class="font-family-mono text-xs md:text-sm text-off-black">
			There are no open positions right now — please check back soon.
		</div>
	</div>
{/if}
