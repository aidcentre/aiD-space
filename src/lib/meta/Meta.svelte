<script lang="ts">
	import { page } from '$app/state';

	// Canonical origin for this site. Hardcoded rather than read from
	// $env/static/public, where a missing value is a hard build failure — and a
	// deploy preview must never declare itself canonical anyway. Both aid-centre.no
	// and aid-center.no serve this site; -centre is the canonical one.
	// No trailing slash: page.url.pathname supplies the leading one.
	const BASE_URL = 'https://aid-centre.no';

	let title = 'Norwegian Centre on AI for Decisions';

	let meta = $derived({
		description:
			'The aiD centre, or the Norwegian Centre on AI for Decisions, is an initiative led by the Research Council of Norway, SINTEF, and NTNU.',
		title,
		...page.data.meta
	});

	function titleDecoration(title: string) {
		return `${title} | aiD`;
	}
</script>

<svelte:head>
	<title>{titleDecoration(meta.title)}</title>
	<meta name="description" content={meta.description} />
	<link rel="canonical" href={`${BASE_URL}${page.url.pathname}`} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>
