<script lang="ts">
	import { fly } from 'svelte/transition';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { menuOpen } from '$lib/stores/menu';
	import NodeSphere from './NodeSphere.svelte';
	import NavButton from './NavButton.svelte';
	import Link from './Link.svelte';

	const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t));

	const settings = $derived(page.data.settings);
	const email = $derived(settings?.contactInformation?.email);
	const phone = $derived(settings?.contactInformation?.phone);
	// Dev-only fallback: show Events until it's added to Settings → Navigation in the studio.
	const navigation = $derived.by(() => {
		const items = settings?.navigation ?? [];
		if (dev && !items.some((item) => item._type === 'events')) {
			return [...items, { _id: 'events-dev-preview', _type: 'events' as const, title: 'Events', url: '/events' }];
		}
		return items;
	});
</script>

{#if $menuOpen}
	<div
		transition:fly={{ y: 0, duration: 800, easing: easeOutExpo }}
		class="pointer-events-none fixed inset-0 z-30 flex flex-col bg-off-black p-4 text-white"
	>
		<div class="pointer-events-auto z-30 flex h-full w-full flex-col justify-between">
			<div
				class="flex flex-col items-end justify-end gap-1 pt-16 md:flex-row md:items-start md:pt-20"
			>
				{#each navigation as navigationItem (navigationItem._id)}
					<NavButton label={navigationItem.title} url={navigationItem.url} />
				{/each}
			</div>
			<div class="flex w-full flex-col gap-8 text-white md:w-120">
				{#if settings?.description}
					<div class="text-sm md:text-base font-family-serif">{settings.description}</div>
				{/if}
				<div class="flex flex-col gap-1">
					{#if email}
						<Link href={`mailto:${email}`} theme="dark">
							{email}
						</Link>
					{/if}
					{#if phone}
						<Link href={`tel:${phone.replace(/\s+/g, '')}`} theme="dark">
							{phone}
						</Link>
					{/if}
					{#if settings?.externalUrl?.url}
						<Link
							href={settings.externalUrl.url}
							theme="dark"
							border={true}
							trailing={true}
						>
							{settings.externalUrl.label ?? settings.externalUrl.url}
						</Link>
					{/if}
				</div>
			</div>
		</div>
		<div
			class="pointer-events-none fixed inset-0 z-20 -mt-24 {$menuOpen
				? 'opacity-50'
				: 'opacity-0'}"
		>
			<NodeSphere theme="dark" />
		</div>
	</div>
{/if}
