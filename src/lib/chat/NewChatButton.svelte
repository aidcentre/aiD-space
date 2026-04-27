<script lang="ts">
	import PencilLine from 'phosphor-svelte/lib/PencilLineIcon';
	let { onclick }: { onclick?: () => void } = $props();
</script>

<div
	role="button"
	tabindex="0"
	{onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick?.()}
	class="mt-6 flex w-fit cursor-pointer flex-row items-center gap-10 rounded-md bg-off-black px-3 py-2"
>
	<p class="font-[IBM_Mono] text-[1rem] leading-6 font-normal text-white">Start new chat</p>
	<PencilLine size={20} color="white"></PencilLine>
</div>
