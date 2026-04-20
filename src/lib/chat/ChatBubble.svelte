<script lang="ts">
	import ResearcherCard from './ResearcherCard.svelte';
	import chatSymbol from '$lib/assets/chat_symbol.svg';
	import Scramble from '$lib/actions/Scramble.svelte';
	import NewChatButton from './NewChatButton.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { role, content, researchers = [], researcher_info = [] } = $props();
	let animationDone = $state(false);
	let userBubble = $state<HTMLDivElement>();

	onMount(() => {
		if (role === 'user') {
			// TODO: make it scroll higher (to top of screen)
			userBubble?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
</script>

{#if role === 'user'}
	<div
		bind:this={userBubble}
		class="mb-18 w-fit scroll-mt-24 self-end rounded-3xl bg-white px-4 py-3 font-[IBM_Math] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black md:rounded-[46px]"
	>
		{content}
	</div>
{/if}

{#if role === 'ai'}
	<div class="mb-18">
		<div class="mb-2 flex w-fit max-w-175.5 flex-col gap-4 md:mb-6 md:flex-row">
			<img src={chatSymbol} alt="AID's chat symbol" class="mt-1 size-5 rounded-sm bg-off-black" />
			<p class="font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black">
				<Scramble text={content} speed="fast" typeOn onDone={() => (animationDone = true)} />
			</p>
		</div>
		{#if animationDone && researchers.length > 0}
			<li class="flex flex-col gap-2">
				{#each researchers as r, i}
					<div in:fly={{ y: 10, duration: 350, delay: i * 500 }}>
						<ResearcherCard
							name={r[0].replace(/_/g, ' ')}
							score={r[1].toFixed(2)}
							description="Researcher"
						/>
					</div>
				{/each}
			</li>
		{/if}
		<NewChatButton />
	</div>
{/if}
