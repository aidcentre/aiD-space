<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	let title = 'Norwegian Centre on AI for Decisions';

	let meta = $derived({
		// default values
		description:
			'The aiD centre, or the Norwegian Centre on AI for Decisions, is an initiative led by the Research Council of Norway, SINTEF, and NTNU.',
		title,
		// per-page customizations, defined in the +page.ts files
		...page.data.meta
	});

	function titleDecoration(title: string) {
		return `${title} | aiD`;
	}
</script>

<svelte:head>
	<title>{titleDecoration(meta.title)}</title>
	<meta name="description" content={meta.description} />
	<!-- many links (e.g. https://aid-centre.no, https://www.aid-centre.no, https://aid-center.no) can access the content of this set. Below, we set the canonical url.-->
	<link rel="canonical" href={`${PUBLIC_BASE_URL}${page.url.pathname}`} />
	<!-- for SEO, add an apple touch icon -->
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>