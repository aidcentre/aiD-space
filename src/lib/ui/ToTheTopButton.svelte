<script lang="ts">
	import { useScramble } from '$lib/actions/useScramble';
	import ArrowUp from "phosphor-svelte/lib/ArrowUp"; 

	let { onclick }: { onclick?: () => void } = $props();

	const scrambleOptions = $derived({
		text: 'To the top',
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
	aria-label="Scroll to the top"
	class="group hover:bg-white hover:text-off-black relative flex gap-6 md:gap-9 lg:gap-12 cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 font-family-mono text-xs md:text-sm select-none transition-colors duration-800 ease-out-expo z-20 bg-darker-grey text-white"
>
	<ArrowUp class="w-3.25 h-3.25 md:w-4 md:h-4 group-hover:fill-off-black transition-colors duration-800 ease-out-expo" />
	<div use:scrambleAction={scrambleOptions} class="font-family-mono text-sm md:text-base group-hover:text-off-black transition-colors duration-800 ease-out-expo"></div>
</button>
