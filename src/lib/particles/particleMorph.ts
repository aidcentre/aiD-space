/**
 * Particle-morphing node thumbnails for /ParticleMorphingDemo.
 *
 * Instead of a looping WebM, a node's hover thumbnail is its four stills drawn
 * as ~59k round particles (one per pixel of a 236x256 grid, the thumbnail's
 * 162x176 aspect, minus the squircle corners). Each still holds for HOLD
 * seconds with the particles breathing in place, then every particle travels
 * to a pixel of similar colour in the next still, and the fourth morphs back
 * into the first.
 *
 * Rendering is three.js's WebGPURenderer: WebGPU where the browser has it,
 * its WebGL 2 backend everywhere else, from the same TSL node material. All
 * motion is in the vertex stage: each particle carries its position and
 * colour in all four stills as instanced attributes, and the CPU only moves
 * a handful of uniforms per frame. Nothing is re-uploaded between stills.
 *
 * The colour matching is a rank match, a cheap stand-in for optimal
 * transport: the pixels of every still are sorted by a key of (luminance,
 * hue, coarse position), and the n-th pixel of one still is paired with the
 * n-th of the next. Equal counts make it a perfect matching, similar colours
 * land on similar colours, and the position tie-break keeps a flat region
 * moving as one body instead of scattering. Four ~59k sorts take ~20 ms.
 */
import * as THREE from 'three/webgpu';
import {
	clamp,
	float,
	floor,
	instancedBufferAttribute,
	length,
	mix,
	mod,
	mx_noise_vec3,
	sin,
	cos,
	smoothstep,
	sRGBTransferEOTF,
	uniform,
	uv,
	varying,
	vec2,
	vec3,
	vec4,
	fract
} from 'three/tsl';

/** The node thumbnail, in CSS px (see .node-image in NodeTooltip). */
export const FRAME_WIDTH = 162;
export const FRAME_HEIGHT = 176;
const CORNER_RADIUS = 8;
/** squircle.ts's exponent at smoothing 1. */
const CORNER_EXPONENT = 4.5;
/** Room around the frame that particles may swing out into mid-morph. */
export const FRAME_PADDING = 48;

/** Must match scripts/build_particle_demo_assets.py. */
export const GRID_COLUMNS = 236;
export const GRID_ROWS = 256;
export const STILLS = 4;

/** Seconds each still holds, then seconds to morph to the next. */
export const HOLD = 3;
export const MORPH = 1.8;
/** Seconds for the particles to gather into the first still on hover. */
const INTRO = 1.1;
/** Share of the morph by which the last particle sets off after the first. */
const STAGGER = 0.45;

const SPACING = FRAME_HEIGHT / GRID_ROWS;
/** Particle diameter as a multiple of the grid spacing (overlap fills gaps). */
const SIZE = 1.8;

export type Backend = 'webgpu' | 'webgl2';

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

/** Per still, per particle: x, y (CSS px from the frame centre, y up), packed RGB, luminance. */
export type MorphData = Float32Array[];

async function readSheet(url: string): Promise<ImageData> {
	const image = new Image();
	image.decoding = 'async';
	image.src = url;
	await image.decode();
	const canvas = document.createElement('canvas');
	canvas.width = GRID_COLUMNS * STILLS;
	canvas.height = GRID_ROWS;
	const context = canvas.getContext('2d', { willReadFrequently: true });
	if (!context) throw new Error('2D canvas unavailable');
	context.drawImage(image, 0, 0);
	return context.getImageData(0, 0, canvas.width, canvas.height);
}

/** Loads a sheet of four stills and pairs their pixels up by colour. */
export async function prepareMorph(url: string): Promise<MorphData> {
	const { data } = await readSheet(url);
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
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			// Hue, bucketed; greys all share bucket 0.
			const chroma = Math.max(r, g, b) - Math.min(r, g, b);
			const hue =
				chroma < 12 ? 0 : 1 + Math.floor(((Math.atan2(1.732 * (g - b), 2 * r - g - b) / (2 * Math.PI) + 1) % 1) * 15);
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

			// Stored by grid order for now, reordered by rank below.
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

/** Where the loop is at `seconds` after the thumbnail appeared. */
function timeline(seconds: number) {
	const step = HOLD + MORPH;
	const cycle = seconds % (step * STILLS);
	const from = Math.floor(cycle / step);
	const local = cycle - from * step;
	return {
		from,
		to: (from + 1) % STILLS,
		progress: local < HOLD ? 0 : (local - HOLD) / MORPH
	};
}

const oneHot = (index: number, target: THREE.Vector4) =>
	target.set(+(index === 0), +(index === 1), +(index === 2), +(index === 3));

export class ParticleMorph {
	readonly canvas: HTMLCanvasElement;
	backend: Backend | null = null;

	private renderer: THREE.WebGPURenderer;
	private scene = new THREE.Scene();
	private camera: THREE.OrthographicCamera;
	private stills: THREE.InstancedBufferAttribute[] = [];
	private uniforms = {
		time: uniform(0),
		progress: uniform(0),
		intro: uniform(1),
		from: uniform(new THREE.Vector4(1, 0, 0, 0)),
		to: uniform(new THREE.Vector4(0, 1, 0, 0))
	};
	private startedAt = 0;
	private hasData = false;
	private disposed = false;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const width = FRAME_WIDTH + FRAME_PADDING * 2;
		const height = FRAME_HEIGHT + FRAME_PADDING * 2;

		this.renderer = new THREE.WebGPURenderer({ canvas, antialias: false, alpha: true });
		// Particles are 1-2 CSS px across; supersample so they still read as dots.
		this.renderer.setPixelRatio(Math.min(3, Math.max(2, window.devicePixelRatio || 1)));
		this.renderer.setSize(width, height, false);
		this.renderer.setClearColor(0x000000, 0);

		this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 10);
		this.camera.position.z = 5;

		for (let k = 0; k < STILLS; k++) {
			const attribute = new THREE.InstancedBufferAttribute(new Float32Array(PARTICLE_COUNT * 4), 4);
			attribute.setUsage(THREE.DynamicDrawUsage);
			this.stills.push(attribute);
		}
		const random = new Float32Array(PARTICLE_COUNT * 4);
		for (let i = 0; i < random.length; i++) random[i] = Math.random();
		const randomAttribute = new THREE.InstancedBufferAttribute(random, 4);

		const sprite = new THREE.Sprite(this.material(randomAttribute));
		sprite.count = PARTICLE_COUNT;
		sprite.frustumCulled = false;
		this.scene.add(sprite);
	}

	private material(randomAttribute: THREE.InstancedBufferAttribute) {
		const { time, progress, intro, from: fromWeights, to: toWeights } = this.uniforms;
		const [s0, s1, s2, s3] = this.stills.map((a) => instancedBufferAttribute(a));
		const rnd = instancedBufferAttribute(randomAttribute);

		// The weights are one-hot, so this selects a still exactly.
		const pick = (w: typeof fromWeights) =>
			s0.mul(w.x).add(s1.mul(w.y)).add(s2.mul(w.z)).add(s3.mul(w.w));
		const from = pick(fromWeights);
		const to = pick(toWeights);

		// Staggered, eased progress per particle.
		const delay = rnd.x.mul(STAGGER);
		const eased = smoothstep(0, 1, clamp(progress.sub(delay).div(1 - STAGGER), 0, 1));
		const flight = sin(eased.mul(Math.PI));

		const travel = to.xy.sub(from.xy);
		const straight = mix(from.xy, to.xy, eased);

		// Mid-flight: bow sideways off the straight line, and get caught in a
		// slow swirl. Long journeys bow more, so some arc out past the frame.
		const sideways = vec2(travel.y.negate(), travel.x).mul(rnd.y.sub(0.5).mul(0.7));
		const swirl = mx_noise_vec3(vec3(straight.mul(0.012), time.mul(0.2))).xy;
		const flown = straight.add(sideways.add(swirl.mul(22)).mul(flight));

		// At rest: each particle drifts a couple of pixels along a noise
		// field and snaps home when it is smallest, the way TouchDesigner's
		// particlesGpu re-births its flecks, so the still keeps shimmering.
		const life = fract(time.mul(0.45).add(rnd.z));
		const flow = mx_noise_vec3(vec3(flown.mul(0.035), time.mul(0.12).add(7.3))).xy;
		const drifted = flown.add(flow.mul(life).mul(2.4));
		const breath = sin(life.mul(Math.PI));

		// Gathering in on hover, from a loose cloud around the frame.
		const angle = rnd.z.mul(Math.PI * 2);
		const scatter = vec2(cos(angle), sin(angle)).mul(rnd.y.mul(70).add(25));
		const position = drifted.add(scatter.mul(intro.mul(intro)));

		const unpack = (packed: typeof from.z) =>
			vec3(floor(packed.div(65536)), mod(floor(packed.div(256)), 256), mod(packed, 256)).div(255);
		const colour = varying(sRGBTransferEOTF(mix(unpack(from.z), unpack(to.z), eased)));

		const material = new THREE.PointsNodeMaterial({
			transparent: true,
			depthTest: false,
			depthWrite: false
		});
		material.alphaToCoverage = false;
		material.positionNode = vec3(position, 0);
		material.sizeNode = float(SPACING * SIZE)
			.mul(rnd.w.mul(0.4).add(0.8))
			.mul(breath.mul(0.45).add(0.75))
			.mul(flight.mul(0.35).add(1));
		const edge = length(uv().sub(0.5));
		const alpha = smoothstep(0.5, 0.32, edge).mul(float(1).sub(intro));
		material.colorNode = vec4(colour, alpha);
		return material;
	}

	async init(): Promise<Backend> {
		await this.renderer.init();
		const backend = this.renderer.backend as { isWebGPUBackend?: boolean };
		this.backend = backend.isWebGPUBackend ? 'webgpu' : 'webgl2';
		// Build the pipeline now rather than on the first hover.
		await this.renderer.compileAsync(this.scene, this.camera);
		return this.backend;
	}

	/** Swaps in an article's stills and restarts its loop from the gather-in. */
	show(data: MorphData) {
		data.forEach((still, k) => {
			this.stills[k].array.set(still);
			this.stills[k].needsUpdate = true;
		});
		this.hasData = true;
		this.startedAt = performance.now();
	}

	/** Draws one frame; call from requestAnimationFrame while visible. */
	render(now = performance.now()) {
		if (this.disposed || !this.hasData) return;
		const seconds = (now - this.startedAt) / 1000;
		const { from, to, progress } = timeline(seconds);
		const intro = Math.max(0, 1 - seconds / INTRO);
		this.uniforms.time.value = now / 1000;
		this.uniforms.progress.value = progress;
		this.uniforms.intro.value = intro * intro * (3 - 2 * intro);
		oneHot(from, this.uniforms.from.value);
		oneHot(to, this.uniforms.to.value);
		this.renderer.render(this.scene, this.camera);
	}

	dispose() {
		this.disposed = true;
		this.renderer.dispose();
	}
}
