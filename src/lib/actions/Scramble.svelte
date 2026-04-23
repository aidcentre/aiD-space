<script lang="ts">
	import { useScramble } from '$lib/actions/useScramble';

	const {
		text = '',
		speed = 'fast',
		typeOn = false,
		onDone = undefined,
		loop = 0,
		class: className = ''
	} = $props<{
		text?: string;
		speed?: 'fast' | 'slow';
		/** start with empty string? */
		typeOn?: boolean;
		onDone?: () => void;
		/** animation replay delay in ms, 0 means no loop */
		loop?: number;
		class?: string;
	}>();

	const speeds = { fast: 1.2, slow: 0.6 };

	let el = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!el) return;
		const s = useScramble(el, {
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
			onAnimationEnd: () => {
				onDone?.();
				if (loop > 0) setTimeout(() => s.replay(), loop);
			}
		});
		return () => s.destroy();
	});
</script>

<div bind:this={el} class="{className} min-h-full w-full"></div>
