<script lang="ts">
	import profilePlaceholder from '$lib/assets/aiD_profile_picture_black.png';
	import { findResearcher, displayNameFor } from '$lib/data/researchers';

	let { name, score }: { name: string; score: number } = $props();

	const researcher = $derived(findResearcher(name));
	const displayName = $derived(researcher?.displayName ?? displayNameFor(name));
	const subtitle = $derived(
		[researcher?.title, researcher?.institution].filter(Boolean).join(' · ') || 'AID researcher'
	);
	const profileUrl = $derived(researcher?.profileUrl || undefined);

	// researchers.ts records which photos exist; onerror is a second line of
	// defence for a file that 404s on the CDN.
	let broken = $state(false);
	const imageSrc = $derived(!broken && researcher?.image ? researcher.image : profilePlaceholder);

	const scoreText = $derived(score.toFixed(2));
</script>

<div class="divide-solid divide-off-black overflow-hidden rounded-lg bg-white">
	<div class="flex flex-col gap-3 p-3 md:flex-row md:items-center">
		<img
			src={imageSrc}
			alt={displayName}
			width="80"
			height="80"
			loading="eager"
			decoding="async"
			onerror={() => (broken = true)}
			class="size-20 shrink-0 rounded-lg bg-light-grey object-cover grayscale select-none"
		/>
		<div>
			{#if profileUrl}
				<a
					href={profileUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="mb-1 block font-[Milling] leading-6 font-bold hover:underline"
				>
					{displayName}
				</a>
			{:else}
				<p class="mb-1 font-[Milling] leading-6 font-bold">{displayName}</p>
			{/if}
			<p class="font-[IBM_Mono] text-[14px] leading-4.5 font-normal tracking-[0.28px]">
				{subtitle}
			</p>
		</div>
	</div>
	<div class="flex flex-row items-center border-t border-light-grey bg-white">
		<div class="flex-1 rounded-b-lg px-3 py-2">
			<p class="font-[IBM_Mono] text-xs leading-4 font-bold text-grey">
				Relevance score: {scoreText}
			</p>
		</div>
	</div>
</div>
