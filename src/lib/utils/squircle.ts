/**
 * Superellipse ("squircle") corners as a Svelte action.
 *
 * The prototype wraps nearly every rounded surface in @squircle-js/react. That
 * package is React-only, so this reimplements the part that matters: a
 * clip-path whose corners follow a superellipse instead of a circular arc,
 * which is what gives the design its iOS-like softness. `border-radius` stays
 * on the elements as the fallback for anything that cannot clip.
 *
 *   <div use:squircle={{ radius: 8 }}>
 *
 * The path is recomputed on resize, because a clip-path polygon is expressed
 * in absolute pixels and a stale one would crop the element.
 */

export type SquircleOptions = {
	/** Corner radius in px, matching the `border-radius` you would have used. */
	radius?: number;
	/**
	 * 0 is a plain rounded rectangle, 1 is the full superellipse the prototype
	 * uses everywhere (`cornerSmoothing={1}`).
	 */
	smoothing?: number;
	/** Skip the clip entirely, e.g. while an element is measured or hidden. */
	disabled?: boolean;
};

/** Points around the whole outline. 96 is smooth at any radius the design uses. */
const STEPS = 96;

function cornerPath(width: number, height: number, radius: number, smoothing: number): string {
	// Clamp so a large radius on a small box degrades to a stadium rather than
	// folding the path back on itself.
	const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
	if (r === 0) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';

	// n = 2 is a circular arc; larger n flattens the middle of the corner and
	// pushes the curvature into its ends. 4.5 matches the node sprite texture.
	const n = 2 + smoothing * 2.5;
	const points: string[] = [];

	// Sweep one continuous superellipse and slide each point onto the nearest
	// corner's centre. Walking the outline in a single pass is what keeps the
	// winding consistent — building it corner by corner is easy to get subtly
	// backwards on one of them, which folds the polygon into a bowtie.
	for (let i = 0; i < STEPS; i++) {
		const t = (Math.PI * 2 * i) / STEPS;
		const ct = Math.cos(t);
		const st = Math.sin(t);
		const ux = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
		const uy = Math.sign(st) * Math.pow(Math.abs(st), 2 / n);

		const cx = ux >= 0 ? width - r : r;
		const cy = uy >= 0 ? height - r : r;

		points.push(`${(cx + r * ux).toFixed(2)}px ${(cy + r * uy).toFixed(2)}px`);
	}

	return `polygon(${points.join(', ')})`;
}

export function squircle(node: HTMLElement, options: SquircleOptions = {}) {
	let current: SquircleOptions = options;

	const apply = () => {
		const { radius = 8, smoothing = 1, disabled = false } = current;
		const { width, height } = node.getBoundingClientRect();

		if (disabled || width < 1 || height < 1) {
			node.style.clipPath = '';
			return;
		}

		node.style.clipPath = cornerPath(width, height, radius, smoothing);
	};

	const observer = new ResizeObserver(apply);
	observer.observe(node);
	apply();

	return {
		update(next: SquircleOptions) {
			current = next;
			apply();
		},
		destroy() {
			observer.disconnect();
			node.style.clipPath = '';
		}
	};
}
