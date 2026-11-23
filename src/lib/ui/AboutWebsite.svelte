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
	const contentId = `${ABOUT_WEBSITE_ID}-content`;

	const about = $derived(resolveAboutWebsite(page.data.settings));

	// Collapsed by default: visitors open it themselves, while links to
	// `#about-this-website` (like the one in the menu) open it for them.
	let open = $state(false);
	let sectionEl = $state<HTMLElement>();

	async function reveal() {
		open = true;
		await tick();
		sectionEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	$effect(() => {
		if (page.url.hash === `#${ABOUT_WEBSITE_ID}`) reveal();
	});

	onMount(() => {
		window.addEventListener(ABOUT_WEBSITE_REVEAL_EVENT, reveal);
		return () => window.removeEventListener(ABOUT_WEBSITE_REVEAL_EVENT, reveal);
	});
</script>

<section id={ABOUT_WEBSITE_ID} bind:this={sectionEl} class="scroll-mt-24 md:scroll-mt-28">
	<div class="mx-auto my-30 max-w-[1920px] px-4 md:my-40 lg:my-60">
		<h2>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={open ? contentId : undefined}
				onclick={() => (open = !open)}
				class="group flex w-full cursor-pointer items-center justify-between gap-4 border-y border-dashed border-off-black py-4 text-left text-off-black transition-colors duration-800 ease-out-expo select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-off-black md:py-6 dark:border-white dark:text-white"
			>
				<span class="text-md font-bold md:text-lg lg:text-xl">{about.title}</span>
				<span
					class="flex items-center justify-center rounded-lg bg-white p-2 transition-colors duration-800 ease-out-expo group-hover:bg-off-black group-hover:text-white md:p-2.5 dark:bg-darker-grey"
				>
					<Plus
						class="h-4 w-4 transition-transform duration-800 ease-out-expo md:h-5 md:w-5 {open
							? 'rotate-45'
							: ''}"
					/>
				</span>
			</button>
		</h2>

		{#if open}
			<div id={contentId} transition:slide={{ duration: 800, easing: easeOutExpo }}>
				<div class="grid grid-cols-12 gap-x-8 gap-y-12 pt-8 md:gap-y-16 md:pt-12 lg:gap-x-12 lg:pt-16">
					<div class="col-span-12 flex flex-col gap-4 md:gap-6 lg:col-span-7 lg:col-start-3">
						{#each about.paragraphs as paragraph, i (i)}
							<p
								class="font-family-serif text-sm text-off-black transition-colors duration-800 ease-out-expo md:text-md lg:text-lg dark:text-white"
							>
								{paragraph}
							</p>
						{/each}
					</div>

					<dl
						class="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:col-span-8 lg:col-start-3"
					>
						{#each about.credits as credit (credit._key)}
							<div class="flex flex-col gap-1 md:gap-2">
								{#if credit.label}
									<dt class="text-sm font-bold text-greyed-out lg:text-md">{credit.label}</dt>
								{/if}
								{#if credit.value}
									<dd
										class="font-family-serif text-sm text-off-black transition-colors duration-800 ease-out-expo md:text-md dark:text-white"
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
