<script lang="ts">
	/**
	 * The "Next" card that follows the open article.
	 *
	 * The prototype pins this to the bottom-right and drives its scale from a
	 * scroll-progress calculation. Here it simply sits in the panel's own
	 * scroll flow, directly beneath it: you reach it by scrolling past the end
	 * of the article, which is the behaviour the scroll maths was there to
	 * produce, without a second element measuring the first.
	 */
	import { squircle } from '$lib/utils/squircle';
	import type { Article } from '$lib/data/articles';

	let {
		article,
		onselect
	}: {
		article: Article;
		onselect?: (id: string) => void;
	} = $props();
</script>

<button
	use:squircle={{ radius: 24 }}
	type="button"
	class="group pointer-events-auto relative z-[2] mt-4 mr-4 mb-4 ml-auto flex w-[745px] max-w-[calc(100vw-32px)] cursor-pointer flex-col items-start gap-4 bg-off-black p-8 text-left text-white transition-colors duration-500 ease-out-expo hover:bg-white hover:text-off-black max-[900px]:mr-0 max-[900px]:mb-0 max-[900px]:w-full max-[900px]:max-w-none"
	onclick={() => onselect?.(article.id)}
>
	<span class="font-[IBM_Mono] text-[14px] leading-none text-medium-grey">Next</span>
	<span class="flex items-center gap-4">
		<span
			use:squircle={{ radius: 6 }}
			aria-hidden="true"
			class="ease-out-expo h-6 w-0 shrink-0 bg-off-black transition-[width] duration-500 group-hover:w-6"
		></span>
		<span class="font-[Milling] text-[24px] leading-8 font-bold">{article.title}</span>
	</span>
</button>
