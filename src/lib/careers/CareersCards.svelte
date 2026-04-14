<script lang="ts">
	import CareersCard from './CareersCard.svelte';
	import { careers_data } from '$lib/data/careers';
</script>

<div class="flex flex-col gap-3">
	{#each careers_data as card (card.title)}
		<CareersCard {card} />
	{/each}
</div>
