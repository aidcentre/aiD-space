<script lang="ts">
	/**
	 * A retrieved article in the search transcript.
	 *
	 * The backend ranks documents and researchers from the same hits, so this
	 * sits alongside ResearcherCard: the researcher cards answer "who can help",
	 * these answer "what did they write". The abstract honours whichever
	 * Content Mode the visitor picked in the node panel.
	 */
	import { formatPublicationDate, type Article } from '$lib/data/articles';
	import { abstractFor, loadAbstracts } from '$lib/data/abstracts';
	import { contentMode } from '$lib/stores/contentMode';
	import { findResearcher, displayNameFor } from '$lib/data/researchers';

	let {
		article,
		score,
		onopen
	}: {
		article: Article;
		/** Retrieval score from the backend, already normalised 0-1 by similarity. */
		score: number;
		onopen?: (id: string) => void;
	} = $props();

	let abstractsReady = $state(false);
	$effect(() => {
		loadAbstracts().then(() => (abstractsReady = true));
	});

	const body = $derived(
		abstractsReady ? abstractFor(article.id, $contentMode, article.teaser) : article.teaser
	);

	const researcher = $derived(findResearcher(article.researcher));
	const researcherName = $derived(
		researcher?.displayName ?? displayNameFor(article.researcher)
	);
</script>

<article class="overflow-hidden rounded-lg bg-white">
	<button
		type="button"
		class="flex w-full cursor-pointer flex-col gap-2 p-3 text-left"
		onclick={() => onopen?.(article.id)}
	>
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
			<h3 class="font-[Milling] text-[16px] leading-6 font-bold text-off-black">
				{article.title}
			</h3>
			<span class="flex items-center gap-2 font-[IBM_Mono] text-xs leading-4 text-grey">
				<span>Node</span><span>//</span><span>{article.nodeNumber}</span>
			</span>
		</div>

		<p class="line-clamp-3 font-[IBM_Math] text-[14px] leading-[130%] text-off-black">
			{body}
		</p>
	</button>

	<div
		class="flex flex-row flex-wrap items-center border-t border-light-grey font-[IBM_Mono] text-xs leading-4 text-grey"
	>
		<span class="px-3 py-2 font-bold">Relevance score: {score.toFixed(2)}</span>
		<span class="self-stretch border-l border-light-grey" aria-hidden="true"></span>
		<span class="px-3 py-2">{researcherName}</span>
		<span class="self-stretch border-l border-light-grey" aria-hidden="true"></span>
		<span class="px-3 py-2">{formatPublicationDate(article.publicationDate)}</span>
		{#if article.doi}
			<span class="self-stretch border-l border-light-grey" aria-hidden="true"></span>
			<a
				href={`https://doi.org/${article.doi}`}
				target="_blank"
				rel="noopener noreferrer"
				class="px-3 py-2 text-off-black underline underline-offset-4"
			>
				DOI ↗
			</a>
		{/if}
	</div>
</article>
