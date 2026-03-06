<script lang="ts">
	type ColourMode = 'light' | 'dark';

	let {
		label,
		link,
		colourMode = 'light'
	}: {
		label: string;
		link: string;
		colourMode: ColourMode;
	} = $props();

	const colourVariants: Record<ColourMode, string> = {
		light: 'bg-white text-off-black hover:bg-(--hover-grey) hover:opacity-80',
		dark: 'bg-off-black text-light-grey hover:bg-(--dark-grey)'
	};
</script>

<a
	class="{colourVariants[
		colourMode
	]} flex rounded-[6px] px-4 py-3 text-[1rem] leading-[110%] font-bold"
	href="/{link}">{label}</a
>
