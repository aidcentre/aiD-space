<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { menuOpen } from '$lib/stores/menu';
	import NavButton from './NavButton.svelte';
	import Link from './Link.svelte';
	import { ABOUT_WEBSITE_HREF, resolveAboutWebsite, revealAboutWebsite } from '$lib/aboutWebsite';

	const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t));

	const settings = $derived(page.data.settings);
	const email = $derived(settings?.contactInformation?.email);
	const phone = $derived(settings?.contactInformation?.phone);
	const aboutWebsiteTitle = $derived(resolveAboutWebsite(settings).title);

	// The link's hash opens the section when arriving from another page; on the
	// What is aiD page itself the menu has to be closed and the section told directly.
	function openAboutWebsite() {
		menuOpen.set(false);
		revealAboutWebsite();
	}

	// Fallback: show Events until it's added to Settings → Navigation in the studio.
	const navigation = $derived.by(() => {
		const items = settings?.navigation ?? [];
		if (!items.some((item) => item._type === 'events')) {
			return [...items, { _id: 'events-fallback', _type: 'events' as const, title: 'Events', url: '/events' }];
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
						<Link href={`mailto:${email}`} theme="dark" class="-mx-3 -my-2 px-3 py-2">
							{email}
						</Link>
					{/if}
					{#if phone}
						<Link href={`tel:${phone.replace(/\s+/g, '')}`} theme="dark">
							{phone}
						</Link>
					{/if}
					<!-- Stacked on mobile; one row with a bullet between them on desktop. -->
					<div class="flex flex-col items-start gap-1 md:w-max md:flex-row md:items-center md:gap-2">
						{#if settings?.externalUrl?.url}
							<Link
								href={settings.externalUrl.url}
								theme="dark"
								border={true}
								trailing={true}
							>
								{settings.externalUrl.label ?? settings.externalUrl.url}
							</Link>
							<span aria-hidden="true" class="hidden font-family-mono text-sm select-none md:inline">
								•
							</span>
						{/if}
						<Link href={ABOUT_WEBSITE_HREF} theme="dark" border={true} onclick={openAboutWebsite}>
							{aboutWebsiteTitle}
						</Link>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
