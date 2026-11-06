<script lang="ts">
	import './style.css?v=20260910';
	import Meta from '$lib/meta/Meta.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={data.settings?.favicon?.asset?.url} />
</svelte:head>

<Meta />

{@render children()}