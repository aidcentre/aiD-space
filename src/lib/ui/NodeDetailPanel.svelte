<script lang="ts">
	/**
	 * The article panel that docks to the right when a node is opened.
	 *
	 * Ported from the prototype's NodeDetailPanel, with two differences: the
	 * metadata row shows the article's real publication date rather than a
	 * "date added", and the Content Mode row actually switches the abstract
	 * between its three readings instead of only moving the active pill.
	 */
	import { squircle } from '$lib/utils/squircle';
	import { useScramble } from '$lib/actions/useScramble';
	import { formatPublicationDate, type Article } from '$lib/data/articles';
	import {
		CONTENT_MODES,
		CONTENT_MODE_LABELS,
		abstractFor,
		loadAbstracts,
		type ContentMode
	} from '$lib/data/abstracts';
	import { contentMode } from '$lib/stores/contentMode';
	import { findResearcher, displayNameFor } from '$lib/data/researchers';
	import profilePlaceholder from '$lib/assets/aiD_profile_picture_black.png';
	import patternBlack from '$lib/assets/pattern_black.svg';
	import endOfArticle from '$lib/assets/end_of_article.svg';

	let {
		article,
		children
	}: {
		article: Article;
		/** Rendered below the panel, inside its scroll container. */
		children?: import('svelte').Snippet;
	} = $props();

	/**
	 * Abstracts arrive over the network, so track the load and re-read on
	 * settle. Until then the teaser stands in, which is the same prose.
	 */
	let abstractsReady = $state(false);
	$effect(() => {
		loadAbstracts().then(() => (abstractsReady = true));
	});

	const body = $derived(
		abstractsReady
			? abstractFor(article.id, $contentMode, article.teaser)
			: article.teaser
	);

	const researcher = $derived(findResearcher(article.researcher));
	const researcherName = $derived(
		researcher?.displayName ?? displayNameFor(article.researcher)
	);
	const researcherSubtitle = $derived(
		[researcher?.title, researcher?.institution].filter(Boolean).join(' · ') || 'aiD researcher'
	);

	let brokenPhoto = $state(false);
	const photo = $derived(
		!brokenPhoto && researcher?.image ? researcher.image : profilePlaceholder
	);

	// The title decodes in after the panel has finished sliding, matching the
	// prototype's 400ms beat.
	let titleEl = $state<HTMLElement>();
	let scrambler: ReturnType<typeof useScramble> | null = null;

	$effect(() => {
		const text = article.title;
		if (!titleEl) return;

		if (scrambler) {
			scrambler.update({ text });
			return;
		}

		const element = titleEl;
		const timer = setTimeout(() => {
			scrambler = useScramble(element, {
				text,
				playOnMount: true,
				speed: 1.5,
				tick: 1,
				step: 6,
				scramble: 4,
				overflow: true,
				range: [65, 90]
			});
		}, 400);
		return () => clearTimeout(timer);
	});

	$effect(() => () => scrambler?.destroy());

	function choose(mode: ContentMode) {
		contentMode.set(mode);
	}
</script>

<div class="pointer-events-none fixed inset-0 z-[8] overflow-y-auto">
	<aside
		use:squircle={{ radius: 32 }}
		class="panel pointer-events-auto relative z-[2] mt-[88px] mr-4 mb-4 ml-auto flex w-max max-w-[calc(100vw-32px)] flex-col overflow-hidden bg-white text-off-black max-[900px]:mt-[290px] max-[900px]:mr-0 max-[900px]:mb-0 max-[900px]:w-full max-[900px]:max-w-none"
	>
		<div
			class="flex w-[577px] max-w-[calc(100vw-32px)] flex-col px-[76px] pt-12 pb-8 max-[900px]:px-4"
		>
			<div
				class="mb-4 flex w-full max-w-[577px] flex-wrap gap-8 pt-4 font-[IBM_Mono] text-[14px] leading-none"
				aria-label="Article metadata"
			>
				<span class="inline-flex items-center gap-2 whitespace-nowrap">
					<span class="text-medium-grey">Type</span>
					<span class="text-medium-grey">//</span>
					<span>Article</span>
				</span>
				<span class="inline-flex items-center gap-2 whitespace-nowrap">
					<span class="text-medium-grey">Publication date</span>
					<span class="text-medium-grey">//</span>
					<span>{formatPublicationDate(article.publicationDate)}</span>
				</span>
				{#if article.venue}
					<span class="inline-flex items-center gap-2">
						<span class="text-medium-grey">Published in</span>
						<span class="text-medium-grey">//</span>
						<span>{article.venue}</span>
					</span>
				{/if}
				{#if article.doi}
					<span class="inline-flex items-center gap-2">
						<span class="text-medium-grey">DOI</span>
						<span class="text-medium-grey">//</span>
						<a
							href={`https://doi.org/${article.doi}`}
							target="_blank"
							rel="noopener noreferrer"
							class="break-all underline underline-offset-4"
						>
							{article.doi} ↗
						</a>
					</span>
				{/if}
			</div>

			<h3
				class="m-0 w-full max-w-[577px] text-left font-[Milling] text-[36px] leading-[48px] font-bold"
				aria-label={article.title}
			>
				<img src={patternBlack} alt="" aria-hidden="true" class="mb-4 h-4 w-4" />
				<span bind:this={titleEl}></span>
			</h3>

			{#if article.authors.length > 0}
				<p
					class="mt-4 w-full max-w-[577px] text-left font-[IBM_Mono] text-[14px] leading-[18px] text-grey"
				>
					{article.authors.join(', ')}
				</p>
			{/if}
		</div>

		<div class="flex flex-col items-center px-[76px] pb-12 max-[900px]:px-4">
			<div class="mb-6 flex w-full max-w-[577px] flex-wrap items-center gap-2">
				<span class="font-[IBM_Mono] text-[14px] leading-none whitespace-nowrap text-medium-grey">
					Content Mode //
				</span>
				<div class="flex items-center gap-2" role="group" aria-label="Content mode">
					{#each CONTENT_MODES as mode (mode)}
						<button
							use:squircle={{ radius: 8 }}
							type="button"
							class="cursor-pointer rounded-lg p-2 font-[IBM_Mono] text-[14px] leading-none backdrop-blur-[10px] {$contentMode ===
							mode
								? 'bg-off-black text-white'
								: 'bg-transparent text-off-black'}"
							aria-pressed={$contentMode === mode}
							onclick={() => choose(mode)}
						>
							{CONTENT_MODE_LABELS[mode]}
						</button>
					{/each}
				</div>
			</div>

			<div class="w-full max-w-[577px] text-left font-[IBM_Math] text-[18px] leading-6">
				{#key `${article.id}-${$contentMode}`}
					<p class="body-in m-0">{body}</p>
				{/key}
			</div>

			<img src={endOfArticle} alt="End of article" class="my-8 h-4" />

			<div class="flex w-full max-w-[577px] flex-col gap-2">
				<div class="flex items-center gap-6 rounded-2xl bg-off-black p-3 text-left text-white">
					<img
						src={photo}
						alt={researcherName}
						onerror={() => (brokenPhoto = true)}
						class="size-[97px] shrink-0 rounded-lg object-cover grayscale"
					/>
					<div class="flex flex-col gap-2">
						<p class="m-0 font-[IBM_Mono] text-[14px] leading-[18px]">
							{researcherName}<br aria-hidden="true" />↳ {researcherSubtitle}
						</p>
						<div class="flex flex-wrap gap-4">
							{#if researcher?.profileUrl}
								<a
									href={researcher.profileUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="font-[IBM_Mono] text-[14px] underline underline-offset-4"
								>
									Profile ↗
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</aside>

	{@render children?.()}
</div>

<style>
	.panel {
		border-radius: 32px;
		animation: panel-in 240ms ease-out both;
		animation-delay: 400ms;
	}

	@media (max-width: 900px) {
		.panel {
			border-radius: 24px 24px 0 0;
		}
	}

	@keyframes panel-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.body-in {
		animation: body-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@keyframes body-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
