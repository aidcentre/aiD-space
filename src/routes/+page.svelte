<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import Header from '$lib/ui/Header.svelte';
	import Menu from '$lib/ui/Menu.svelte';
	import SearchBar from '$lib/ui/SearchBar.svelte';
	import NodeField from '$lib/ui/NodeField.svelte';
	import NodeTooltip from '$lib/ui/NodeTooltip.svelte';
	import NodeDetailPanel from '$lib/ui/NodeDetailPanel.svelte';
	import NextNodeCard from '$lib/ui/NextNodeCard.svelte';
	import { menuOpen } from '$lib/stores/menu';
	import HomeText from '$lib/ui/HomeText.svelte';
	import BackToFieldButton from '$lib/ui/BackToFieldButton.svelte';
	import ResearcherCard from '$lib/chat/ResearcherCard.svelte';
	import ArticleResultCard from '$lib/chat/ArticleResultCard.svelte';
	import Scramble from '$lib/actions/Scramble.svelte';
	import chatSymbol from '$lib/assets/chat_symbol.svg';
	import { articles, articleById, findArticle, type Article } from '$lib/data/articles';
	import { trackVisualViewport } from '$lib/actions/visualViewport';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const home = $derived(data.home);

	/** One document as the backend ranked it. Empty before the API is redeployed. */
	interface RelevantDocument {
		doc_id: string;
		title: string;
		name: string;
		score: number;
		similarity: number;
	}

	interface Message {
		role: 'user' | 'ai';
		content: string;
		researchers?: [string, number][];
		documents?: RelevantDocument[];
		isError?: boolean;
	}

	let messages = $state<Message[]>([]);
	let loading = $state(false);
	let bottomAnchor = $state<HTMLDivElement>();
	/** Bumped when the transcript is cleared, so a reply in flight is dropped. */
	let session = 0;

	const active = $derived(messages.length > 0);
	const fallbackUrl = $derived(
		home?.externalUrl ?? 'https://aidexpertisesearch-nrmdnyesl7oppreljp2epb.streamlit.app/'
	);

	// --- node field -------------------------------------------------------

	let selectedId = $state<string | null>(null);
	let hoveredId = $state<string | null>(null);
	let anchorEl = $state<HTMLDivElement | null>(null);
	let innerWidth = $state(1440);

	const selectedArticle = $derived(selectedId ? (articleById(selectedId) ?? null) : null);
	const activeArticle = $derived(
		selectedArticle ?? (hoveredId ? (articleById(hoveredId) ?? null) : null)
	);

	/** The article one place along the field, for the "Next" card. */
	const nextArticle = $derived.by(() => {
		if (!selectedArticle) return null;
		const index = articles.indexOf(selectedArticle);
		return articles[(index + 1) % articles.length] ?? null;
	});

	// Below this the panel fills the viewport, so the search bar would have
	// nowhere to sit beside it.
	const PANEL_SEARCH_HIDE_BREAKPOINT_PX = 1100;
	const PANEL_OCCUPIED_WIDTH_PX = 761;

	const SEARCH_GUTTER_PX = 32;

	/**
	 * The panel scrolls in its own overlay, so on a platform with classic
	 * scrollbars it sits that much further left than its width alone says. The
	 * bar is `fixed` against the full viewport and does not, hence measuring
	 * rather than assuming: on macOS-style overlay scrollbars this is 0.
	 */
	let scrollbarWidth = $state(0);

	const searchHidden = $derived(!!selectedId && innerWidth < PANEL_SEARCH_HIDE_BREAKPOINT_PX);
	/**
	 * How far to slide the bar left so it recentres in the space the panel
	 * leaves. Expressed as an offset from centre rather than an absolute `left`
	 * so the resting position stays pure CSS — it must be right on first paint
	 * and on any viewport this measurement has not caught up with yet.
	 */
	const searchShift = $derived(
		selectedId && innerWidth >= PANEL_SEARCH_HIDE_BREAKPOINT_PX
			? (PANEL_OCCUPIED_WIDTH_PX + scrollbarWidth) / 2
			: 0
	);
	/**
	 * The widest the bar may be. Sliding it left is only half the job: on a
	 * window narrow enough that the panel takes most of it — half a wide
	 * monitor, say — a 700px bar still reaches back under the panel and its
	 * "Next" card. Capping it to the room actually left over keeps the two
	 * apart at every size, and keeps the bar tracking the window on resize.
	 */
	const searchMaxWidth = $derived(Math.max(0, innerWidth - SEARCH_GUTTER_PX - searchShift * 2));

	function select(id: string | null) {
		selectedId = id;
	}

	onMount(() => {
		const probe = document.createElement('div');
		probe.style.cssText =
			'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;';
		document.body.appendChild(probe);
		scrollbarWidth = probe.offsetWidth - probe.clientWidth;
		probe.remove();

		return trackVisualViewport();
	});

	// --- search -----------------------------------------------------------

	function resolveDocuments(documents: RelevantDocument[] | undefined) {
		if (!documents) return [];
		const resolved: { article: Article; score: number }[] = [];
		for (const doc of documents) {
			const article = findArticle(doc.doc_id, doc.name, doc.title);
			// A document dropped by the article filter (a CV, say) has no card
			// to show, and a re-ingest can leave an id pointing nowhere.
			if (article) resolved.push({ article, score: doc.similarity || doc.score });
		}
		return resolved;
	}

	/** Clear the results and give the screen back to the node field. */
	function returnToField() {
		session++;
		messages = [];
		loading = false;
		selectedId = null;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function search(query: string) {
		const q = query?.trim();
		if (!q || loading) return;

		const current = ++session;

		// The transcript and the detail panel both want the middle of the
		// screen; asking a question means you are done with the open article.
		selectedId = null;

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
			if (current !== session) return;

			messages.push({
				role: 'ai',
				content: result.text_answer,
				researchers: result.most_relevant_researchers,
				documents: result.relevant_documents
			});
		} catch (err) {
			console.error('Error retrieving RAG response:', err);
			if (current === session) messages.push({ role: 'ai', content: '', isError: true });
		} finally {
			if (current === session) {
				loading = false;
				await scrollToBottom();
			}
		}
	}

	async function scrollToBottom() {
		await tick();
		bottomAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}
</script>

<svelte:window bind:innerWidth />

<div class="fixed inset-0 -z-10">
	<NodeField
		{articles}
		{selectedId}
		bind:hoveredId
		paused={$menuOpen}
		interactive={!active}
		anchor={anchorEl}
		onselect={select}
	/>
</div>

<Header />
<Menu />

<!-- Tooltip layer. NodeField parks `anchorEl` on the active node each frame. -->
<div class="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
	<div bind:this={anchorEl} class="absolute top-0 left-0" style="visibility: hidden;">
		<NodeTooltip
			article={activeArticle}
			selected={!!selectedId}
			onclose={() => select(null)}
		/>
	</div>
</div>

{#if selectedArticle}
	<NodeDetailPanel article={selectedArticle}>
		{#snippet children()}
			{#if nextArticle}
				<NextNodeCard article={nextArticle} onselect={select} />
			{/if}
		{/snippet}
	</NodeDetailPanel>
{/if}

<main class="pointer-events-none relative z-[1]">
	{#if active}
		<div class="mx-auto flex min-h-screen w-full max-w-200 flex-col px-4 pt-28 pb-28">
			<div class="pointer-events-auto flex flex-col gap-12">
				<div class="sticky top-20 z-[3] w-fit self-start">
					<BackToFieldButton onclick={returnToField} />
				</div>

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
											<ResearcherCard name={r[0]} score={r[1]} />
										</li>
									{/each}
								</ul>
							{/if}

							{#key msg}
								{@const documents = resolveDocuments(msg.documents)}
								{#if documents.length > 0}
									<p
										class="mt-8 mb-2 w-fit bg-white px-1 font-[IBM_Mono] text-xs text-grey"
										style="box-shadow: 0 0 60px 30px rgba(255, 255, 255, 1);"
									>
										Research behind this answer
									</p>
									<ul class="flex flex-col gap-2">
										{#each documents as doc, di (doc.article.id)}
											<li in:fly={{ y: 10, duration: 350, delay: di * 120 }}>
												<ArticleResultCard
													article={doc.article}
													score={doc.score}
													onopen={select}
												/>
											</li>
										{/each}
									</ul>
								{/if}
							{/key}
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

			<div class="pointer-events-auto mt-auto pt-12">
				<p
					class="mx-auto w-fit max-w-full bg-white px-1 text-center font-family-mono text-[10px] font-light text-off-black md:text-xs"
					style="box-shadow: 0 0 60px 30px rgba(255, 255, 255, 1);"
				>
					You are interacting with an AI system. Responses are AI-generated and may be inaccurate.
				</p>
			</div>
			<div bind:this={bottomAnchor}></div>
		</div>
	{/if}
</main>

<div
	class="search-dock ease-out-expo fixed bottom-4 left-1/2 z-[10] flex w-[700px] justify-center transition-[transform,opacity,max-width] duration-500"
	style:max-width={`${searchMaxWidth}px`}
	style:transform={`translateX(calc(-50% - ${searchShift}px))`}
	style:opacity={searchHidden ? 0 : 1}
	style:pointer-events={searchHidden ? 'none' : 'auto'}
	aria-hidden={searchHidden}
>
	<SearchBar onsubmit={search} {loading} />
</div>

{#if !active && !selectedId}
	<!-- Lifted clear of the search bar, which is now docked to the bottom. -->
	<div class="pointer-events-none fixed inset-x-0 bottom-24 z-[1]">
		<HomeText description={home?.description ?? ''} />
	</div>
{/if}

<style>
	/* Sit above the soft keyboard rather than under it. */
	@media (max-width: 900px) {
		.search-dock {
			bottom: auto;
			top: calc(var(--vv-offset-top, 0px) + var(--vv-height, 100vh) - 56px - 16px);
		}
	}
</style>
