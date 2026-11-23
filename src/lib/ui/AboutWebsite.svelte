<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Plus from 'phosphor-svelte/lib/Plus';
	import {
		ABOUT_WEBSITE_ID,
		ABOUT_WEBSITE_REVEAL_EVENT,
		resolveAboutWebsite
	} from '$lib/aboutWebsite';

	const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t));
	const headingId = `${ABOUT_WEBSITE_ID}-heading`;
	const contentId = `${ABOUT_WEBSITE_ID}-content`;

	const about = $derived(resolveAboutWebsite(page.data.settings));

	// Collapsed by default: visitors open it themselves, while links to
	// `#about-this-website` (like the one in the menu) open it for them.
	let open = $state(false);
	let anchorEl = $state<HTMLElement>();

	async function reveal(behavior: ScrollBehavior) {
		open = true;
		await tick();
		anchorEl?.scrollIntoView({ behavior, block: 'start' });
	}

	// Arriving with the hash (from another page, or a fresh load): jump straight
	// there, correcting wherever the browser landed before the page settled.
	$effect(() => {
		if (page.url.hash === `#${ABOUT_WEBSITE_ID}`) reveal('instant');
	});

	// Asked again while already here (the URL doesn't change): glide to it.
	onMount(() => {
		const onReveal = () => reveal('smooth');
		window.addEventListener(ABOUT_WEBSITE_REVEAL_EVENT, onReveal);
		return () => window.removeEventListener(ABOUT_WEBSITE_REVEAL_EVENT, onReveal);
	});
</script>

<section aria-labelledby={headingId}>
	<div class="relative mx-auto my-30 max-w-[1920px] px-4 md:my-40 lg:my-60">
		<!--
			The hash target sits above the heading so the fixed header doesn't cover
			it. (scroll-margin isn't enough: after a deep-link navigation SvelteKit
			re-scrolls to the target's own top, ignoring the margin.)
		-->
		<span
			id={ABOUT_WEBSITE_ID}
			bind:this={anchorEl}
			class="pointer-events-none absolute -top-24 md:-top-28"
		></span>
		<h2 id={headingId}>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={open ? contentId : undefined}
				onclick={() => (open = !open)}
				class="group ease-out-expo flex w-full cursor-pointer items-center justify-between gap-4 border-y border-dashed border-off-black py-4 text-left text-off-black transition-colors duration-800 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-off-black md:py-6 dark:border-white dark:text-white"
			>
				<span class="text-md font-bold md:text-lg lg:text-xl">{about.title}</span>
				<span
					class="ease-out-expo flex items-center justify-center rounded-lg bg-white p-2 transition-colors duration-800 group-hover:bg-off-black group-hover:text-white md:p-2.5 dark:bg-darker-grey"
				>
					<Plus
						class="ease-out-expo h-4 w-4 transition-transform duration-800 md:h-5 md:w-5 {open
							? 'rotate-45'
							: ''}"
					/>
				</span>
			</button>
		</h2>

		{#if open}
			<div id={contentId} transition:slide={{ duration: 800, easing: easeOutExpo }}>
				<div
					class="grid grid-cols-12 gap-x-8 gap-y-12 pt-8 md:gap-y-16 md:pt-12 lg:gap-x-12 lg:pt-16"
				>
					<div class="col-span-12 flex flex-col gap-4 md:gap-6 lg:col-span-7 lg:col-start-3">
						{#each about.paragraphs as paragraph, i (i)}
							<p
								class="ease-out-expo md:text-md font-family-serif text-sm text-off-black transition-colors duration-800 lg:text-lg dark:text-white"
							>
								{paragraph}
							</p>
						{/each}
					</div>

					<dl
						class="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:col-span-10 lg:col-start-3 xl:col-span-9"
					>
						{#each about.credits as credit (credit._key)}
							<div class="flex flex-col gap-1 md:gap-2">
								{#if credit.label}
									<dt class="lg:text-md text-sm font-bold text-greyed-out">{credit.label}</dt>
								{/if}
								{#if credit.value}
									<dd
										class="ease-out-expo md:text-md font-family-serif text-sm text-off-black transition-colors duration-800 dark:text-white"
									>
										{credit.value}
									</dd>
								{/if}
							</div>
						{/each}
					</dl>
				</div>
			</div>
		{/if}
	</div>
</section>
