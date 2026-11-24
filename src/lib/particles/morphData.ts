/**
 * The particle layout and colour matching for the morphing thumbnails, kept
 * free of three.js so the Web Worker (morphWorker.ts) and the page can load
 * it without pulling in the renderer.
 *
 * The colour matching is a rank match, a cheap stand-in for optimal
 * transport: the pixels of every still are sorted by a key of (luminance,
 * hue, coarse position), and the n-th pixel of one still is paired with the
 * n-th of the next. Equal counts make it a perfect matching, similar colours
 * land on similar colours, and the position tie-break keeps a flat region
 * moving as one body instead of scattering.
 */

/** The node thumbnail, in CSS px (see .node-image in NodeTooltip). */
export const FRAME_WIDTH = 162;
export const FRAME_HEIGHT = 176;
const CORNER_RADIUS = 8;
/** squircle.ts's exponent at smoothing 1. */
const CORNER_EXPONENT = 4.5;
/** Room around the frame that particles may swing out into mid-morph. */
export const FRAME_PADDING = 32;

/**
 * 177x192 = 34k particles before the corners. Must match
 * scripts/build_particle_demo_assets.py. (236x256 read too much like the
 * photo itself; this is 0.75 x 0.75 of that, so it stays a stipple.)
 */
export const GRID_COLUMNS = 177;
export const GRID_ROWS = 192;
export const STILLS = 4;

/** Seconds each still holds once every particle has landed. */
export const HOLD = 3;
/**
 * Each particle sets off a random 0-MORPH_DELAY s into the morph and takes a
 * random FLIGHT_MIN-FLIGHT_MAX s to land, so the new still streams in over
 * a few seconds and single particles can be followed, instead of all of
 * them leaving at once.
 */
export const MORPH_DELAY = 2;
export const FLIGHT_MIN = 1.0;
export const FLIGHT_MAX = 1.6;
/** Seconds from the first particle leaving to the last one landing. */
export const MORPH = MORPH_DELAY + FLIGHT_MAX;

/** Per still, per particle: x, y (CSS px from the frame centre, y up), packed RGB, luminance. */
export type MorphData = Float32Array[];

/** Grid cells inside the squircle, as indices into a GRID_COLUMNS x GRID_ROWS still. */
function frameCells(): Uint32Array {
	const r = CORNER_RADIUS;
	const cells: number[] = [];
	for (let y = 0; y < GRID_ROWS; y++) {
		for (let x = 0; x < GRID_COLUMNS; x++) {
			const px = ((x + 0.5) / GRID_COLUMNS) * FRAME_WIDTH;
			const py = ((y + 0.5) / GRID_ROWS) * FRAME_HEIGHT;
			const cx = px < r ? r : px > FRAME_WIDTH - r ? FRAME_WIDTH - r : px;
			const cy = py < r ? r : py > FRAME_HEIGHT - r ? FRAME_HEIGHT - r : py;
			const dx = Math.abs(px - cx) / r;
			const dy = Math.abs(py - cy) / r;
			if (dx ** CORNER_EXPONENT + dy ** CORNER_EXPONENT <= 1) cells.push(y * GRID_COLUMNS + x);
		}
	}
	return Uint32Array.from(cells);
}

const CELLS = frameCells();
export const PARTICLE_COUNT = CELLS.length;

/** Pairs up the pixels of a sheet's four stills (RGBA, stills side by side). */
export function matchStills(pixels: Uint8ClampedArray): MorphData {
	const rowStride = GRID_COLUMNS * STILLS;
	const count = PARTICLE_COUNT;
	const keys = new Float64Array(count);
	const stills: MorphData = [];

	for (let k = 0; k < STILLS; k++) {
		const out = new Float32Array(count * 4);
		for (let m = 0; m < count; m++) {
			const cell = CELLS[m];
			const x = cell % GRID_COLUMNS;
			const y = (cell - x) / GRID_COLUMNS;
			const i = (y * rowStride + k * GRID_COLUMNS + x) * 4;
			const r = pixels[i];
			const g = pixels[i + 1];
			const b = pixels[i + 2];
			const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			// Hue in 15 buckets; greys all share bucket 0.
			const chroma = Math.max(r, g, b) - Math.min(r, g, b);
			const hue =
				chroma < 12
					? 0
					: 1 +
						Math.floor(
							((Math.atan2(1.732 * (g - b), 2 * r - g - b) / (2 * Math.PI) + 1) % 1) * 15
						);
			// Coarse Z-order position (8x8-cell blocks) so equal colours keep their layout.
			let morton = 0;
			const bx = x >> 3;
			const by = y >> 3;
			for (let bit = 0; bit < 5; bit++) {
				morton |= ((bx >> bit) & 1) << (2 * bit);
				morton |= ((by >> bit) & 1) << (2 * bit + 1);
			}
			const key = (Math.min(63, Math.floor(luma / 4)) * 16 + hue) * 1024 + morton;
			keys[m] = key * 65536 + m;

			// Stored in grid order here, reordered by rank below.
			out[m * 4] = ((x + 0.5) / GRID_COLUMNS - 0.5) * FRAME_WIDTH;
			out[m * 4 + 1] = (0.5 - (y + 0.5) / GRID_ROWS) * FRAME_HEIGHT;
			out[m * 4 + 2] = r * 65536 + g * 256 + b;
			out[m * 4 + 3] = luma / 255;
		}
		keys.sort();
		// Particle n takes the n-th pixel of this still in key order.
		const ranked = new Float32Array(count * 4);
		for (let n = 0; n < count; n++) {
			const m = keys[n] % 65536;
			ranked.set(out.subarray(m * 4, m * 4 + 4), n * 4);
		}
		stills.push(ranked);
	}
	return stills;
}

/** Decodes a sheet to RGBA pixels; works on the main thread and in a worker. */
export async function readSheet(url: string): Promise<Uint8ClampedArray> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	const bitmap = await createImageBitmap(await response.blob(), {
		colorSpaceConversion: 'none',
		premultiplyAlpha: 'none'
	});
	const canvas = new OffscreenCanvas(GRID_COLUMNS * STILLS, GRID_ROWS);
	const context = canvas.getContext('2d', { willReadFrequently: true });
	if (!context) throw new Error('2D canvas unavailable');
	context.drawImage(bitmap, 0, 0);
	bitmap.close();
	return context.getImageData(0, 0, canvas.width, canvas.height).data;
}
