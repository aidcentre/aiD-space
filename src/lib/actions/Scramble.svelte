<script lang="ts">
	import { useScramble } from '$lib/actions/useScramble';

	const { text = '', speed = 'fast', class: className = '', onDone } = $props<{
		text?: string;
		speed?: 'fast' | 'slow';
		class?: string;
		onDone?: () => void;
	}>();

	const speeds = { fast: 1.5, slow: 0.5 };

	// The backend answers in light markdown — **like this** around researcher
	// names. Strip the markers and hand the scrambler a per-character mask so it
	// renders them bold instead of printing the asterisks.
	const parsed = $derived.by(() => {
		const plain: string[] = [];
		const boldMask: boolean[] = [];
		let bold = false;
		let i = 0;
		while (i < text.length) {
			if (text[i] === '*' && text[i + 1] === '*') {
				bold = !bold;
				i += 2;
				continue;
			}
			plain.push(text[i]);
			boldMask.push(bold);
			i++;
		}
		return { text: plain.join(''), boldMask };
	});

	let el = $state<HTMLDivElement | null>(null);
	let scrambler: ReturnType<typeof useScramble> | null = null;

	$effect(() => {
		if (!el) return;
		scrambler = useScramble(el, {
			text: parsed.text,
			boldMask: parsed.boldMask,
			onAnimationEnd: onDone,
			speed: speeds[speed as keyof typeof speeds],
			tick: 1,
			step: 4,
			scramble: 4,
			overflow: true,
			range: [48, 57],
			seed: 0,
			overdrive: 9617.0,
		});
	});
</script>

<div
	bind:this={el}
	class="{className}"
>
</div>