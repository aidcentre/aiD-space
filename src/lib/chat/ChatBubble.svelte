<script lang="ts">
	import ResearcherCard from './ResearcherCard.svelte';
	import chatSymbol from '$lib/assets/chat_symbol.svg';
	let { role, content, researchers = [] } = $props();
</script>

{#if role === 'user'}
	<div
		class="mb-18 w-fit self-end rounded-3xl bg-white px-4 py-3 font-[IBM_Math] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black md:rounded-[46px]"
	>
		{content}
	</div>
{/if}

{#if role === 'ai'}
	<div class="mb-18">
		<div class="mb-2 flex w-fit max-w-175.5 flex-col gap-4 md:mb-6 md:flex-row">
			<img src={chatSymbol} alt="AID's chat symbol" class="mt-1 size-5 rounded-sm bg-off-black" />
			<p class="font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black">
				{content}
			</p>
		</div>
		{#if researchers.length > 0}
			<li class="flex flex-col gap-2">
				{#each researchers as r}
					<ResearcherCard
						name={r[0].replace(/_/g, ' ')}
						description="This is a test description, we're just trying something out"
						score={r[1].toFixed(2)}
					/>
				{/each}
			</li>
		{/if}
	</div>
{/if}
