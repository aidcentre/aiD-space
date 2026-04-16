<script lang="ts">
	import UNLogo from '$lib/assets/UN_logo_bw.svg';
	import Link from '$lib/ui/Link.svelte';

	let { pfp = '', name, description, score, link1 = '', link2 = '' } = $props();
</script>

<div class="mb-24 divide-solid divide-off-black overflow-hidden rounded-lg bg-white">
	<div class="flex flex-col gap-3 p-3 md:flex-row md:items-center">
		<img
			src={UNLogo}
			alt="Logo of the United Nations in black and white"
			class="w-12 select-none md:w-32"
		/>
		<div>
			<p class="mb-1 font-[Milling] leading-6 font-bold">{name}</p>
			<p class="font-[IBM_Mono] text-[14px] leading-4.5 font-normal tracking-[0.28px]">
				{description}
			</p>
		</div>
	</div>
	<div
		class="flex flex-row items-center gap-0 divide-x divide-solid divide-light-grey border-t border-light-grey bg-white"
	>
		<div class="flex-1 rounded-bl-lg px-2 py-2">
			<p class="text-grey font-[IBM_Mono] text-xs leading-4 font-bold">
				Relevance score: {score}
			</p>
		</div>
		<Link
			class="shrink-0 px-3 py-2 text-[14px]"
			href="https://teams.microsoft.com/l/team/19%3AOTSSrCNVkGTBJHl_AzocWwTuuV5ZCNEN7mx4ah62ke41%40thread.tacv2/conversations?groupId=9721146a-0c5c-49cb-a900-198193622f56&tenantId=09a10672-822f-4467-a5ba-5bb375967c05"
			theme="light"
			border={false}
			trailing={true}
			target="_blank"
		>
			NTNU
		</Link>
		<Link
			class="shrink-0 rounded-br-lg px-3 py-2 text-[14px]"
			href="https://teams.microsoft.com/l/team/19%3AOTSSrCNVkGTBJHl_AzocWwTuuV5ZCNEN7mx4ah62ke41%40thread.tacv2/conversations?groupId=9721146a-0c5c-49cb-a900-198193622f56&tenantId=09a10672-822f-4467-a5ba-5bb375967c05"
			theme="light"
			border={false}
			trailing={true}
			target="_blank"
		>
			GitHub
		</Link>
	</div>
</div>
