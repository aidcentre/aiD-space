<script lang="ts">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import SearchBar from '$lib/ui/SearchBar.svelte';
	import NodeSphere from '$lib/ui/NodeSphere.svelte';
	import { menuOpen } from '$lib/stores/menu';
	import HomeText from '$lib/ui/HomeText.svelte';
	import ResearcherCard from '$lib/chat/ResearcherCard.svelte';
	import Scramble from '$lib/actions/Scramble.svelte';
	import chatSymbol from '$lib/assets/chat_symbol.svg';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const home = $derived(data.home);

	interface Message {
		role: 'user' | 'ai';
		content: string;
		researchers?: [string, number][];
		isError?: boolean;
	}

	let messages = $state<Message[]>([]);
	let loading = $state(false);
	let bottomAnchor = $state<HTMLDivElement>();

	const active = $derived(messages.length > 0);
	const fallbackUrl = $derived(
		home?.externalUrl ?? 'https://aidexpertisesearch-nrmdnyesl7oppreljp2epb.streamlit.app/'
	);

	async function search(query: string) {
		const q = query?.trim();
		if (!q || loading) return;

		messages.push({ role: 'user', content: q });
		loading = true;
		await scrollToBottom();

		try {
			const response = await fetch('/chat', {
				method: 'POST',
				body: JSON.stringify({ messages: messages.filter((m) => !m.isError) }),
				headers: { 'Content-Type': 'application/json; charset=UTF-8' }
			});

			if (!response.ok) throw new Error(`backend status ${response.status}`);
			const result = await response.json();
			if (result.error) throw new Error('backend returned error');

			messages.push({
				role: 'ai',
				content: result.text_answer,
				researchers: result.most_relevant_researchers
			});
		} catch (err) {
			console.error('Error retrieving RAG response:', err);
			messages.push({ role: 'ai', content: '', isError: true });
		} finally {
			loading = false;
			await scrollToBottom();
		}
	}

	async function scrollToBottom() {
		await tick();
		bottomAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}
</script>

<div class="fixed inset-0 -z-10 -mt-24">
	<NodeSphere paused={$menuOpen} />
</div>

<Header />
<Menu />

<main class="relative z-[1]">
	<div
		class="mx-auto flex w-full max-w-200 flex-col px-4 {active
			? 'min-h-screen pt-28 pb-16'
			: 'min-h-screen justify-center'}"
	>
		<SearchBar onsubmit={search} {loading} />

		{#if active}
			<div class="mt-10 flex flex-col gap-12">
				{#each messages as msg, i (i)}
					{#if msg.role === 'user'}
						<div
							class="w-fit max-w-full self-end rounded-3xl bg-white px-4 py-3 font-[IBM_Math] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black md:rounded-[46px]"
						>
							{msg.content}
						</div>
					{:else}
						<div>
							<div
								class="flex w-fit max-w-175.5 flex-col gap-4 rounded-2xl bg-white px-4 py-3 md:flex-row"
								style="box-shadow: 0 0 60px 30px rgba(255, 255, 255, 1);"
							>
								<img
									src={chatSymbol}
									alt="aiD chat symbol"
									class="mt-1 size-5 rounded-sm bg-off-black"
								/>
								{#if msg.isError}
									<p
										class="font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black"
									>
										Something went wrong reaching the local expertise search. Make sure the backend
										is running, or try the <a
											href={fallbackUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="underline">alternative version of this search</a
										>.
									</p>
								{:else}
									<Scramble
										text={msg.content}
										speed="fast"
										class="font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black"
									/>
								{/if}
							</div>

							{#if msg.researchers && msg.researchers.length > 0}
								<ul class="mt-6 flex flex-col gap-2">
									{#each msg.researchers as r, ri (r[0])}
										<li in:fly={{ y: 10, duration: 350, delay: ri * 120 }}>
											<ResearcherCard name={r[0].replace(/_/g, ' ')} score={r[1].toFixed(2)} />
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
				{/each}

				{#if loading}
					<div
						class="w-fit rounded-2xl bg-white px-4 py-3"
						style="box-shadow: 0 0 60px 30px rgba(255, 255, 255, 1);"
					>
						<Scramble
							text="Searching the aiD expertise base…"
							speed="slow"
							class="font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-grey"
						/>
					</div>
				{/if}
			</div>
			<div bind:this={bottomAnchor}></div>
		{/if}
	</div>

	{#if !active}
		<HomeText description={home?.description ?? ''} />
	{/if}
</main>
