<script lang="ts">
	import type { Opening } from '$lib/sanity/types';
	import Scramble from '$lib/actions/Scramble.svelte';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import { formatDate } from '$lib/utils';

	let { opening }: { opening: Opening } = $props();

	const typeLabel = $derived(
		opening.type ? opening.type.charAt(0).toUpperCase() + opening.type.slice(1) : ''
	);
	const deadlineLabel = $derived(opening.deadline ? formatDate(opening.deadline) : '');
</script>

<a
	href={opening.externalUrl ?? '#'}
	target="_blank"
	rel="noopener noreferrer"
	class="group flex flex-col rounded-xl bg-white hover:bg-off-black transition-colors duration-800 ease-out-expo"
>
	<div class="overflow-hidden flex gap-3 lg:gap-4 p-4 md:p-5 lg:p-6 border-b border-light-grey group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">
		<div class="hidden md:block w-3.75 h-3.75 md:w-4.5 md:h-4.5 aspect-square rounded scale-0 -ml-7 lg:-ml-9 translate-y-1 group-hover:ml-0 group-hover:bg-white group-hover:scale-100 transition-ml duration-800 ease-out-expo"></div>
		<Scramble
			text={opening.title ?? ''}
			speed="slow"
			class="text-md md:text-lg lg:text-xl font-bold leading-snug text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo"
		/>
		<ArrowUpRight
			class="ml-auto shrink-0 self-start w-4.5 h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo"
		/>
	</div>
	{#if opening.department}
		<div class="flex px-4 md:px-5 lg:px-6 py-3 lg:py-4 border-b border-light-grey group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">
			<div class="font-family-mono text-xs md:text-sm text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo">{opening.department}</div>
		</div>
	{/if}
	<div class="flex items-center">
		{#if typeLabel}
			<span class="font-family-mono text-xs md:text-sm text-off-black px-4 md:px-5 lg:px-6 py-3 lg:py-4 group-hover:text-white transition-colors duration-800 ease-out-expo">{typeLabel}</span>
		{/if}
		{#if opening.location}
			<span class="font-family-mono text-xs md:text-sm text-off-black border-l border-light-grey px-4 md:px-5 lg:px-6 py-3 lg:py-4 group-hover:text-white group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">{opening.location}</span>
		{/if}
		{#if deadlineLabel}
			<span class="font-family-mono text-xs md:text-sm text-off-black border-l border-light-grey px-4 md:px-5 lg:px-6 py-3 lg:py-4 group-hover:text-white group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">{deadlineLabel}</span>
		{/if}
	</div>
</a>
