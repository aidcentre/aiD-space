<script lang="ts">
	import ResearcherCard from './ResearcherCard.svelte';
	let { role, content, researchers = [] } = $props();
</script>

{#if role === 'user'}
	<div
		class="w-fit self-end rounded-3xl bg-white px-4 py-3 font-[IBM_Math] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black md:rounded-[46px]"
	>
		{content}
	</div>
{/if}

{#if role === 'ai'}
	<div
		class="mb-2 w-fit max-w-175.5 rounded-[46px] font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black md:mb-6"
	>
		{content}
	</div>
	{#if researchers.length > 0}
		<div class="flex flex-col gap-2">
			{#each researchers as r}
				<ResearcherCard
					name={r[0].replace(/_/g, ' ')}
					description="This is a test description, we're just trying something out"
					score={r[1].toFixed(2)}
				/>
			{/each}
		</div>
	{/if}
{/if}
