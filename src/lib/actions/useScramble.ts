/**
 * Svelte action implementing the use-scramble algorithm from use-scramble.dev
 * Ported from the React hook for Svelte compatibility.
 */

type RangeOrCharCodes = [number, number] | number[];

export interface UseScrambleOptions {
	/** Text to animate */
	text?: string;
	/** 0-1 range for scramble speed. 1 = 60 redraws/sec */
	speed?: number;
	/** Frames between advancing the scrambler */
	tick?: number;
	/** Characters to add per tick */
	step?: number;
	/** Chance (0-1) each position will randomize */
	chance?: number;
	/** Random positions ahead to scramble */
	seed?: number;
	/** How many times to scramble each character before final */
	scramble?: number;
	/** Start from empty string when overflow is false */
	overflow?: boolean;
	/** Unicode range [min, max] or array of codepoints. Default [48, 57] = digits */
	range?: RangeOrCharCodes;
	/** Overdrive mode: replace with underscore (95) or custom codepoint */
	overdrive?: boolean | number;
	/** Characters to skip scrambling (e.g. spaces) */
	ignore?: string[];
	/** Don't auto-play on mount */
	playOnMount?: boolean;
	/** Trigger animation when element scrolls into view */
	scrollIntoView?: boolean;
	/** Callback when animation starts */
	onAnimationStart?: () => void;
	/** Callback when animation completes */
	onAnimationEnd?: () => void;
	/** Callback on each frame */
	onAnimationFrame?: (result: string) => void;
}

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChar(range: RangeOrCharCodes): string {
	if (range.length === 2) {
		return String.fromCharCode(getRandomInt(range[0], range[1]));
	}
	return String.fromCharCode(range[getRandomInt(0, range.length - 1)]);
}

export function useScramble(
	node: HTMLElement,
	options: UseScrambleOptions = {}
): { replay: () => void; destroy: () => void; update: (options: UseScrambleOptions) => void } {
	let {
		text = '',
		speed = 1,
		tick = 1,
		step = 1,
		chance = 1,
		seed = 1,
		scramble = 1,
		overflow = true,
		range = [48, 57],
		overdrive = true,
		ignore = [' '],
		playOnMount = true,
		scrollIntoView = true,
		onAnimationStart,
		onAnimationEnd,
		onAnimationFrame
	} = options;

	let rafId = 0;
	let elapsed = 0;
	let stepCount = 0;
	let scrambleIndex = 0;
	let overdriveIndex = 0;
	let control: (string | number | null)[] = [];
	let stepVal = step;
	let chanceVal = chance;
	let overdriveVal = overdrive;

	if (typeof window !== 'undefined') {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			stepVal = text.length;
			chanceVal = 0;
			overdriveVal = false;
		}
	}

	const fpsInterval = 1000 / (60 * speed);

	const setIfNotIgnored = (value: string, replace: string | number) =>
		ignore.includes(value) ? value : replace;

	const seedForward = () => {
		if (scrambleIndex === text.length) return;
		for (let i = 0; i < seed; i++) {
			const index = getRandomInt(scrambleIndex, control.length);
			const val = control[index];
			if (typeof val !== 'number' && val !== undefined) {
				control[index] = setIfNotIgnored(
					val as string,
					getRandomInt(0, 10) >= (1 - chanceVal) * 10 ? scramble || seed : 0
				);
			}
		}
	};

	const stepForward = () => {
		for (let i = 0; i < stepVal; i++) {
			if (scrambleIndex < text.length) {
				const currentIndex = scrambleIndex;
				const shouldScramble = getRandomInt(0, 10) >= (1 - chanceVal) * 10;
				control[currentIndex] = setIfNotIgnored(
					text[scrambleIndex],
					shouldScramble ? scramble + getRandomInt(0, Math.ceil(scramble / 2)) : 0
				);
				scrambleIndex++;
			}
		}
	};

	const resizeControl = () => {
		if (text.length < control.length) {
			control.pop();
			control.splice(text.length, stepVal);
		}
		for (let i = 0; i < stepVal; i++) {
			if (control.length < text.length) {
				control.push(setIfNotIgnored(text[control.length] ?? '', 0));
			}
		}
	};

	const onOverdrive = () => {
		if (!overdriveVal) return;
		for (let i = 0; i < stepVal; i++) {
			const max = Math.max(control.length, text.length);
			if (overdriveIndex < max) {
				control[overdriveIndex] = setIfNotIgnored(
					text[overdriveIndex] ?? '',
					typeof overdriveVal === 'boolean' ? 95 : overdriveVal
				);
				overdriveIndex++;
			}
		}
	};

	const onTick = () => {
		stepForward();
		resizeControl();
		seedForward();
	};

	const draw = () => {
		if (!node) return;
		let result = '';
		for (let i = 0; i < control.length; i++) {
			const controlValue = control[i];
			switch (true) {
				case typeof controlValue === 'number' && controlValue > 0:
					result += getRandomChar(range);
					if (i <= scrambleIndex) {
						control[i] = (control[i] as number) - 1;
					}
					break;
				case typeof controlValue === 'string' && (i >= text.length || i >= scrambleIndex):
					result += controlValue;
					break;
				case controlValue === text[i] && i < scrambleIndex:
					result += text[i];
					break;
				case controlValue === 0 && i < text.length:
					result += text[i];
					control[i] = text[i];
					break;
				default:
					result += '';
			}
		}
		node.textContent = result;
		onAnimationFrame?.(result);

		if (result === text) {
			control.splice(text.length, control.length);
			onAnimationEnd?.();
			cancelAnimationFrame(rafId);
		}
		stepCount++;
	};

	const animate = (time: number) => {
		if (!speed) return;
		rafId = requestAnimationFrame(animate);
		onOverdrive();
		const timeElapsed = time - elapsed;
		if (timeElapsed > fpsInterval) {
			elapsed = time;
			if (stepCount % tick === 0) {
				onTick();
			}
			draw();
		}
	};

	const reset = () => {
		stepCount = 0;
		scrambleIndex = 0;
		overdriveIndex = 0;
		if (!overflow) {
			control = new Array(text?.length);
		}
	};

	const play = () => {
		cancelAnimationFrame(rafId);
		const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			node.textContent = text;
			onAnimationEnd?.();
			return;
		}
		reset();
		onAnimationStart?.();
		rafId = requestAnimationFrame(animate);
	};

	const startAnimation = () => {
		if (scrollIntoView) {
			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting && playOnMount) {
							play();
							observer.disconnect();
							break;
						}
					}
				},
				{ rootMargin: '0px', threshold: 0.1 }
			);
			observer.observe(node);
			return () => observer.disconnect();
		}
		if (playOnMount) {
			play();
		} else {
			node.textContent = text;
		}
		return () => {};
	};

	// Initial text & reactive text updates
	node.textContent = text;
	control = text.split('');
	let cleanup: (() => void) | undefined;

	if (playOnMount && !scrollIntoView) {
		play();
	} else if (scrollIntoView) {
		cleanup = startAnimation();
	} else {
		node.textContent = text;
	}

	return {
		replay: play,
		update(newOptions: UseScrambleOptions) {
			cancelAnimationFrame(rafId);
			cleanup?.();

			text = newOptions.text ?? text;
			speed = newOptions.speed ?? speed;
			tick = newOptions.tick ?? tick;
			step = newOptions.step ?? step;
			chance = newOptions.chance ?? chance;
			seed = newOptions.seed ?? seed;
			scramble = newOptions.scramble ?? scramble;
			overflow = newOptions.overflow ?? overflow;
			range = newOptions.range ?? range;
			overdrive = newOptions.overdrive ?? overdrive;
			ignore = newOptions.ignore ?? ignore;
			playOnMount = newOptions.playOnMount ?? playOnMount;
			scrollIntoView = newOptions.scrollIntoView ?? scrollIntoView;
			if (newOptions.onAnimationStart !== undefined) onAnimationStart = newOptions.onAnimationStart;
			if (newOptions.onAnimationEnd !== undefined) onAnimationEnd = newOptions.onAnimationEnd;
			if (newOptions.onAnimationFrame !== undefined) onAnimationFrame = newOptions.onAnimationFrame;

			stepVal = step;
			chanceVal = chance;
			overdriveVal = overdrive;
			if (typeof window !== 'undefined') {
				const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
				if (prefersReducedMotion) {
					stepVal = text.length;
					chanceVal = 0;
					overdriveVal = false;
				}
			}

			node.textContent = text;
			control = text.split('');
			if (playOnMount && !scrollIntoView) {
				play();
			} else if (scrollIntoView) {
				cleanup = startAnimation();
			} else {
				node.textContent = text;
			}
		},
		destroy() {
			cancelAnimationFrame(rafId);
			cleanup?.();
		}
	};
}
