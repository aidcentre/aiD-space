<script lang="ts">
	import { useScramble } from '$lib/actions/useScramble';

	const {
		text = '',
		speed = 'fast',
		typeOn = false,
		onDone = undefined,
		class: className = ''
	} = $props<{
		text?: string;
		speed?: 'fast' | 'slow';
		/** start with empty string? */
		typeOn?: boolean;
		onDone?: () => void;
		class?: string;
	}>();

	const speeds = { fast: 1.2, slow: 0.6 };

	let el = $state<HTMLDivElement | null>(null);
	let scrambler: ReturnType<typeof useScramble> | null = null;

	$effect(() => {
		if (!el) return;
		scrambler = useScramble(el, {
			text,
			speed: speeds[speed as keyof typeof speeds],
			tick: 1,
			step: 4,
			scramble: 4,
			overflow: !typeOn,
			scrollIntoView: !typeOn,
			range: [48, 57],
			seed: 0,
			overdrive: 9617.0,
			onAnimationEnd: onDone
		});
	});
</script>

<div bind:this={el} class="{className} min-h-full w-full"></div>
