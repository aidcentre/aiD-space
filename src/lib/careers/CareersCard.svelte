<script lang="ts">
	import type { CareerCard } from '$lib/data/careers';
    import Scramble from '$lib/actions/Scramble.svelte';

	let { card }: { card: CareerCard } = $props();
</script>

<a
	href={card.href}
	class="group flex flex-col rounded-xl bg-white hover:bg-off-black transition-colors duration-800 ease-out-expo"
>
	<div class="overflow-hidden flex gap-3 lg:gap-4 p-4 md:p-5 lg:p-6 border-b border-light-grey group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">
        <div class="hidden md:block w-4.5 h-4.5 lg:w-5 lg:h-5 aspect-square rounded scale-0 -ml-7 lg:-ml-9 translate-y-0.75 group-hover:ml-0 group-hover:bg-white group-hover:scale-100 transition-ml duration-800 ease-out-expo"></div>
        <Scramble
			text={card.title}
			speed="slow"
			class="text-md md:text-lg lg:text-xl font-bold leading-snug text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo"
		/>
	</div>
    <div class="flex px-4 md:px-5 lg:px-6 py-3 lg:py-4 border-b border-light-grey group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">
		<div class="font-family-mono text-xs md:text-sm text-off-black group-hover:text-white transition-colors duration-800 ease-out-expo">{card.department}</div>
    </div>
	<div class="flex items-center">
		<span class="font-family-mono text-xs md:text-sm text-off-black px-4 md:px-5 lg:px-6 py-3 lg:py-4 group-hover:text-white transition-colors duration-800 ease-out-expo">{card.type}</span>
		<span class="font-family-mono text-xs md:text-sm text-off-black border-l border-light-grey px-4 md:px-5 lg:px-6 py-3 lg:py-4 group-hover:text-white group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">{card.location}</span>
		<span class="font-family-mono text-xs md:text-sm text-off-black border-l border-light-grey px-4 md:px-5 lg:px-6 py-3 lg:py-4 group-hover:text-white group-hover:border-darker-grey transition-colors duration-800 ease-out-expo">{card.deadline}</span>
	</div>
</a>