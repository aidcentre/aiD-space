<script lang="ts">
	import { useScramble } from '$lib/actions/useScramble';
	import ArrowDown from "phosphor-svelte/lib/ArrowDown"; 

	let { open = false, onclick }: { open: boolean; onclick?: () => void } = $props();

	const scrambleOptions = $derived({
		text: open ? 'Close' : 'Menu',
		speed: 0.6,
		tick: 1,
		step: 4,
		scramble: 4,
		overflow: true,
		range: [48, 57],
		seed: 0,
		overdrive: 9617.0,
		scrollIntoView: false
	});

	function scrambleAction(node: HTMLElement, options: typeof scrambleOptions) {
		const api = useScramble(node, { ...options, playOnMount: false });
		return {
			update(newOptions: typeof scrambleOptions) {
				api.update({ ...newOptions, playOnMount: true });
			},
			destroy: () => api.destroy()
		};
	}
</script>

<button
	{onclick}
	aria-label="Toggle menu"
	aria-expanded={open}
	class="group hover:bg-light-grey relative flex w-24 md:w-30 lg:w-36 cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 font-family-mono text-xs md:text-sm select-none transition-colors duration-800 ease-out-expo z-30 {open ? 'bg-white text-off-black' : 'bg-off-black text-white'}"
>
	<div use:scrambleAction={scrambleOptions} class="font-family-mono text-sm md:text-base group-hover:text-off-black transition-colors duration-800 ease-out-expo"></div>
	<ArrowDown class="{open ? 'rotate-180' : ''} w-3.5 h-3.5 md:w-4 md:h-4 group-hover:fill-off-black transition-colors duration-800 ease-out-expo" />
</button>
