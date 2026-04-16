<script lang="ts">
	let { role, content } = $props();
</script>

{#if role === 'user'}
	<div
		class="w-fit self-end rounded-3xl bg-white px-4 py-3 font-[IBM_Math] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black md:rounded-[46px]"
	>
		{content}
	</div>
{/if}

{#if role === 'ai'}
	<div
		class="w-fit max-w-175.5 rounded-[46px] font-[IBM_Mono] text-[1rem] leading-6 font-normal tracking-[0.32px] text-black"
	>
		{content}
	</div>
{/if}
