<script lang="ts">
	import { management_data } from '$lib/data/management';
	import profile_placeholder from '$lib/assets/aiD_profile_picture_black.png';

	let { name, score } = $props();

	const researcher_data = management_data.find((p) => p.name.toLowerCase() === name.toLowerCase());

	const imageSrc = profile_placeholder;
	const description = researcher_data
		? `${researcher_data?.title}, ${researcher_data?.affiliation} `
		: 'Researcher';
</script>

<div class="divide-solid divide-off-black overflow-hidden rounded-lg bg-white">
	<div class="flex flex-col gap-3 p-3 md:flex-row md:items-center">
		<img src={imageSrc} alt="Researcher {name}" class="w-20 rounded-lg select-none" />
		<div>
			<p class="mb-1 font-[Milling] leading-6 font-bold">{name}</p>
			<p class="font-[IBM_Mono] text-[14px] leading-4.5 font-normal tracking-[0.28px]">
				{description}
			</p>
		</div>
	</div>
	<div class="flex flex-row items-center border-t border-light-grey bg-white">
		<div class="flex-1 rounded-b-lg px-3 py-2">
			<p class="text-grey font-[IBM_Mono] text-xs leading-4 font-bold">
				Relevance score: {score}
			</p>
		</div>
	</div>
</div>
