<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_BASE_URL } from '$env/static/public';

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
	<link rel="canonical" href={`${PUBLIC_BASE_URL}${page.url.pathname}`} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>