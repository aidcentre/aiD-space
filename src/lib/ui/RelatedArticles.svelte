<script lang="ts">
	/**
	 * The relevant articles that follow the open article.
	 *
	 * Up to three papers closest to it in content, each with its relevance
	 * score, from lists worked out offline (see $lib/data/related). It sits in
	 * the panel's own scroll flow, directly beneath it, so you reach it by
	 * reading to the end. An article with nothing close enough gets no section
	 * rather than a weak suggestion.
	 */
	import { squircle } from '$lib/utils/squircle';
	import { formatPublicationDate, type Article } from '$lib/data/articles';
	import { loadRelated, relatedFor } from '$lib/data/related';
	import { findResearcher, displayNameFor } from '$lib/data/researchers';

	let {
		article,
		onselect
	}: {
		article: Article;
		onselect?: (id: string) => void;
	} = $props();

	let ready = $state(false);
	$effect(() => {
		loadRelated().then(() => (ready = true));
	});

	const related = $derived(ready ? relatedFor(article.id) : []);

	const headingId = $props.id();

	function researcherName(item: Article): string {
		return findResearcher(item.researcher)?.displayName ?? displayNameFor(item.researcher);
	}
</script>

{#if related.length > 0}
	<section
		use:squircle={{ radius: 24 }}
		aria-labelledby={headingId}
		class="related pointer-events-auto relative z-[2] mt-4 flex w-0 min-w-full flex-col gap-4 bg-off-black p-8 text-white max-[900px]:px-4"
	>
		<h3 id={headingId} class="font-[IBM_Mono] text-[14px] leading-none text-medium-grey">
			Relevant articles
		</h3>

		<ol class="flex flex-col gap-2">
			{#each related as { article: item, score } (item.id)}
				<li>
					<button
						use:squircle={{ radius: 16 }}
						type="button"
						class="group ease-out-expo flex w-full cursor-pointer flex-col items-start gap-3 rounded-2xl bg-darker-grey p-4 text-left transition-colors duration-500 hover:bg-white hover:text-off-black focus-visible:bg-white focus-visible:text-off-black focus-visible:outline-none"
						onclick={() => onselect?.(item.id)}
					>
						<span
							class="flex flex-wrap items-center gap-x-6 gap-y-2 font-[IBM_Mono] text-[14px] leading-none"
						>
							<span class="inline-flex items-center gap-2 whitespace-nowrap">
								<span class="text-medium-grey">Relevance score</span>
								<span class="text-medium-grey">//</span>
								<span>{score.toFixed(2)}</span>
							</span>
							<span class="text-medium-grey">
								{researcherName(item)}{#if item.publicationDate}
									· {formatPublicationDate(item.publicationDate)}{/if}
							</span>
						</span>
						<span class="flex items-center">
							<span
								use:squircle={{ radius: 6 }}
								aria-hidden="true"
								class="ease-out-expo h-6 w-0 shrink-0 bg-off-black transition-[width,margin] duration-500 group-hover:mr-4 group-hover:w-6 group-focus-visible:mr-4 group-focus-visible:w-6"
							></span>
							<span class="font-[Milling] text-[20px] leading-7 font-bold">{item.title}</span>
						</span>
					</button>
				</li>
			{/each}
		</ol>
	</section>
{/if}

<style>
	/* Arrive with the panel above, on the same beat. */
	.related {
		animation: related-in 240ms ease-out both;
		animation-delay: 400ms;
	}

	@keyframes related-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
