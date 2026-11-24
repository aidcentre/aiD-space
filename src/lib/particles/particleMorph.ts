/**
 * Particle-morphing node thumbnails for /ParticleMorphingDemo.
 *
 * Instead of a looping WebM, a node's hover thumbnail is its four stills drawn
 * as ~34k round particles (one per pixel of a 177x192 grid, the thumbnail's
 * 162x176 aspect, minus the squircle corners). Each still holds for HOLD
 * seconds with the particles breathing in place, then every particle travels
 * to a pixel of similar colour in the next still (see morphData.ts), and the
 * fourth morphs back into the first.
 *
 * Rendering is three.js's WebGPURenderer: WebGPU where the browser has it,
 * its WebGL 2 backend everywhere else, from the same TSL node material. All
 * motion is in the vertex stage: each particle carries its position and
 * colour in the two stills it is between as instanced attributes, uploaded
 * once per transition, and the CPU only moves three uniforms per frame.
 *
 * Kept cheap on purpose (it showed 50% in Task Manager during morphs):
 * frames are capped at 30 fps while a still holds and 60 while moving, the
 * canvas uses the screen's density rather than supersampling, and the vertex
 * stage, which runs once per quad corner (~136k times a frame), is a handful
 * of sines with no colour-space maths.
 */
import * as THREE from 'three/webgpu';
import {
	abs,
	clamp,
	cos,
	float,
	floor,
	fract,
	instancedBufferAttribute,
	length,
	max,
	min,
	mix,
	mod,
	pow,
	screenUV,
	sin,
	smoothstep,
	uniform,
	uv,
	varying,
	vec2,
	vec3,
	vec4
} from 'three/tsl';
import {
	CORNER_EXPONENT,
	CORNER_RADIUS,
	FRAME_HEIGHT,
	FRAME_PADDING,
	FRAME_WIDTH,
	FLIGHT_MAX,
	FLIGHT_MIN,
	HOLD,
	MORPH,
	MORPH_DELAY,
	PARTICLE_COUNT,
	STILLS,
	matchStills,
	readSheet,
	type MorphData
} from './morphData';

/** Seconds for the particles to gather into the first still on hover. */
const INTRO = 1.1;
/**
 * Mean particle diameter in CSS px: 1.25 x 1.25 the first version's (1.8
 * grid spacings at 256 rows), so the dots read as dots, not pixels.
 */
const PARTICLE_SIZE = 1.25 * 1.25 * 1.8 * (FRAME_HEIGHT / 256);
/** How far (CSS px) a resting particle drifts before it snaps home. */
const REST_DRIFT = 3.4;
/** Drift cycles per second, per particle (phases are staggered). */
const REST_RATE = 0.6;
/** Radius (CSS px) of the small orbit every particle also wanders. */
const REST_WANDER = 0.9;
/**
 * Within this many CSS px of the frame's edge, a resting particle's drift
 * across that edge fades out (it still slides along it), so the image keeps
 * a flat outline while its inside shimmers.
 */
const EDGE_CALM = 6;

export type Backend = 'webgpu' | 'webgl2';

// --- preparing an article's particles, in a worker ---------------------------

let worker: Worker | null | undefined;
let nextRequest = 0;
const pending = new Map<number, { resolve: (d: MorphData) => void; reject: (e: Error) => void }>();

function morphWorker(): Worker | null {
	if (worker !== undefined) return worker;
	try {
		worker = new Worker(new URL('./morphWorker.ts', import.meta.url), { type: 'module' });
		worker.onmessage = ({ data }) => {
			const request = pending.get(data.id);
			pending.delete(data.id);
			if (data.error) request?.reject(new Error(data.error));
			else request?.resolve(data.stills);
		};
	} catch {
		worker = null;
	}
	return worker;
}

/** Loads a sheet of four stills and pairs their pixels up by colour. */
export function prepareMorph(url: string): Promise<MorphData> {
	const target = morphWorker();
	if (!target) return readSheet(url).then(matchStills);
	return new Promise((resolve, reject) => {
		const id = nextRequest++;
		pending.set(id, { resolve, reject });
		target.postMessage({ id, url: new URL(url, location.href).href });
	});
}

// --- rendering ----------------------------------------------------------------

/** Where the loop is at `seconds` after the thumbnail appeared. */
function timeline(seconds: number) {
	const step = HOLD + MORPH;
	const cycle = seconds % (step * STILLS);
	const from = Math.floor(cycle / step);
	const local = cycle - from * step;
	return {
		from,
		to: (from + 1) % STILLS,
		/** Seconds into the morph; 0 while the still holds. */
		morphTime: local < HOLD ? 0 : local - HOLD
	};
}

/**
 * Frame caps. A held still only drifts a few pixels a second, so 30 fps is
 * plenty; the morph and gather-in get 60. Without a cap the canvas redraws
 * at the monitor's rate (120-240 Hz on many), for no visible gain.
 */
const HOLD_FRAME_MS = 1000 / 30;
const MOTION_FRAME_MS = 1000 / 60;

export class ParticleMorph {
	backend: Backend | null = null;

	private renderer: THREE.WebGPURenderer;
	private scene = new THREE.Scene();
	private camera: THREE.OrthographicCamera;
	/** Only the two stills being morphed are bound; see bindPair(). */
	private fromStill: THREE.InstancedBufferAttribute;
	private toStill: THREE.InstancedBufferAttribute;
	private data: MorphData | null = null;
	private boundPair = -1;
	private uniforms = {
		time: uniform(0),
		morphTime: uniform(0),
		intro: uniform(1)
	};
	private startedAt = 0;
	private lastFrame = -Infinity;
	private disposed = false;

	/** `forceWebGL` skips WebGPU, to try the fallback on a browser that has it. */
	constructor(canvas: HTMLCanvasElement, { forceWebGL = false } = {}) {
		const width = FRAME_WIDTH + FRAME_PADDING * 2;
		const height = FRAME_HEIGHT + FRAME_PADDING * 2;

		this.renderer = new THREE.WebGPURenderer({
			canvas,
			antialias: false,
			alpha: true,
			forceWebGL
		});
		// The screen's own density, capped: forcing 2x on a 1x screen was 4x
		// the pixels to fill and composite, and the ~2 px dots read as dots
		// without it.
		this.renderer.setPixelRatio(Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
		this.renderer.setSize(width, height, false);
		this.renderer.setClearColor(0x000000, 0);
		// The stills' colours go straight to the canvas, so neither the vertex
		// stage nor the output pass converts colour spaces.
		this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

		this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 10);
		this.camera.position.z = 5;

		const still = () => {
			const attribute = new THREE.InstancedBufferAttribute(new Float32Array(PARTICLE_COUNT * 4), 4);
			attribute.setUsage(THREE.DynamicDrawUsage);
			return attribute;
		};
		this.fromStill = still();
		this.toStill = still();
		const random = new Float32Array(PARTICLE_COUNT * 4);
		for (let i = 0; i < random.length; i++) random[i] = Math.random();
		const randomAttribute = new THREE.InstancedBufferAttribute(random, 4);

		const sprite = new THREE.Sprite(this.material(randomAttribute));
		sprite.count = PARTICLE_COUNT;
		sprite.frustumCulled = false;
		this.scene.add(sprite);
	}

	private material(randomAttribute: THREE.InstancedBufferAttribute) {
		const { time, morphTime, intro } = this.uniforms;
		const from = instancedBufferAttribute(this.fromStill);
		const to = instancedBufferAttribute(this.toStill);
		// x: start delay, y: arc, z: life phase, w: size
		const rnd = instancedBufferAttribute(randomAttribute);

		// Each particle leaves at its own random moment (0-2 s in) and flies
		// for its own random time, so the morph is a stream, not a burst.
		// The flight time comes from a hash of two of the random channels so
		// it does not correlate with the delay, the arc or the size.
		const delay = rnd.x.mul(MORPH_DELAY);
		const flightTime = fract(rnd.y.mul(7.13).add(rnd.w.mul(3.71)))
			.mul(FLIGHT_MAX - FLIGHT_MIN)
			.add(FLIGHT_MIN);
		const eased = smoothstep(0, 1, clamp(morphTime.sub(delay).div(flightTime), 0, 1));
		const flight = sin(eased.mul(Math.PI));

		const travel = to.xy.sub(from.xy);
		const straight = mix(from.xy, to.xy, eased);

		// Mid-flight: bow sideways off the straight line and ride a slow
		// swirl. Long journeys bow more, so some arc out past the frame.
		const sideways = vec2(travel.y.negate(), travel.x).mul(rnd.y.sub(0.5).mul(0.7));
		const swirl = vec2(
			sin(straight.y.mul(0.045).add(time.mul(0.9))),
			cos(straight.x.mul(0.04).sub(time.mul(0.8)))
		);
		const flown = straight.add(sideways.add(swirl.mul(16)).mul(flight));

		// At rest: each particle drifts a few pixels along a flow field and
		// snaps home when it is smallest, the way TouchDesigner's
		// particlesGpu re-births its flecks, so the still keeps shimmering.
		// On top, every particle wanders a small orbit of its own.
		const life = fract(time.mul(REST_RATE).add(rnd.z));
		const flow = vec2(
			sin(flown.y.mul(0.11).add(time.mul(0.7))),
			cos(flown.x.mul(0.1).sub(time.mul(0.6)))
		);
		const wander = vec2(
			sin(time.mul(rnd.x.mul(1.5).add(1.2)).add(rnd.z.mul(Math.PI * 2))),
			cos(time.mul(rnd.w.mul(1.5).add(1.0)).add(rnd.y.mul(Math.PI * 2)))
		);
		// Near the frame's edge, damp the drift across it: x near the left and
		// right sides, y near the top and bottom, both in the corners. Measured
		// from the straight path, which stays inside the frame mid-morph.
		const toEdge = vec2(FRAME_WIDTH / 2, FRAME_HEIGHT / 2).sub(abs(straight));
		const calm = vec2(smoothstep(0, EDGE_CALM, toEdge.x), smoothstep(0, EDGE_CALM, toEdge.y));
		const drift = flow.mul(life.mul(REST_DRIFT)).add(wander.mul(REST_WANDER));
		const drifted = flown.add(drift.mul(calm));
		const breath = sin(life.mul(Math.PI));

		// Gathering in on hover, from a loose cloud around the frame.
		const angle = rnd.z.mul(Math.PI * 2);
		const scatter = vec2(cos(angle), sin(angle)).mul(rnd.y.mul(70).add(25));
		const position = drifted.add(scatter.mul(intro.mul(intro)));

		const unpack = (packed: typeof from.z) =>
			vec3(floor(packed.div(65536)), mod(floor(packed.div(256)), 256), mod(packed, 256)).div(255);
		const colour = varying(mix(unpack(from.z), unpack(to.z), eased));

		const material = new THREE.PointsNodeMaterial({
			transparent: true,
			depthTest: false,
			depthWrite: false
		});
		material.alphaToCoverage = false;
		material.positionNode = vec3(position, 0);
		// The outermost row of dots never shrinks below a full dot, so the
		// clipped edge below stays solid while they breathe.
		const rim = float(1).sub(smoothstep(0, 2, min(toEdge.x, toEdge.y)));
		material.sizeNode = float(PARTICLE_SIZE)
			.mul(rnd.w.mul(0.4).add(0.8))
			.mul(max(breath.mul(0.45).add(0.75), rim.mul(1.3)))
			.mul(flight.mul(0.35).add(1));

		// Resting dots are clipped to the thumbnail's squircle, so the image
		// has a crisp, flat outline with rounded corners. Dots in flight (and
		// the gather-in cloud) are not, so they can still swing out past it.
		const settled = varying(float(1).sub(flight).mul(float(1).sub(intro)));
		const width = FRAME_WIDTH + FRAME_PADDING * 2;
		const height = FRAME_HEIGHT + FRAME_PADDING * 2;
		// The shape is symmetric, so screenUV's y direction does not matter.
		const pixel = screenUV.sub(0.5).mul(vec2(width, height));
		const inset = abs(pixel).sub(vec2(FRAME_WIDTH / 2 - CORNER_RADIUS, FRAME_HEIGHT / 2 - CORNER_RADIUS));
		const corner = max(inset, vec2(1e-4)).div(CORNER_RADIUS);
		const outside = pow(
			pow(corner.x, CORNER_EXPONENT).add(pow(corner.y, CORNER_EXPONENT)),
			1 / CORNER_EXPONENT
		)
			.sub(1)
			.mul(CORNER_RADIUS)
			.add(min(max(inset.x, inset.y), 0));
		const inside = smoothstep(0.4, -0.4, outside);

		const edge = length(uv().sub(0.5));
		const alpha = smoothstep(0.5, 0.32, edge)
			.mul(float(1).sub(intro))
			.mul(mix(float(1), inside, settled));
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
		this.data = data;
		this.boundPair = -1;
		this.startedAt = performance.now();
		this.lastFrame = -Infinity;
	}

	/**
	 * Uploads the pair of stills the loop is between (~1 MB, once per
	 * transition, at the start of a hold when nothing is in flight), so the
	 * vertex stage reads two attributes instead of selecting from all four.
	 */
	private bindPair(from: number, to: number) {
		if (!this.data || this.boundPair === from) return;
		this.fromStill.array.set(this.data[from]);
		this.toStill.array.set(this.data[to]);
		this.fromStill.needsUpdate = true;
		this.toStill.needsUpdate = true;
		this.boundPair = from;
	}

	/**
	 * Draws a frame if one is due; call from requestAnimationFrame while
	 * visible. Returns false when it skipped (frame cap, or no article yet).
	 */
	render(now = performance.now()): boolean {
		if (this.disposed || !this.data) return false;
		const seconds = (now - this.startedAt) / 1000;
		const { from, to, morphTime } = timeline(seconds);
		const moving = morphTime > 0 || seconds < INTRO;
		// Scheduled rather than "at least N ms apart", so the average is the
		// cap on any refresh rate (144 Hz alternates gaps of 2 and 3 ticks
		// instead of always waiting 3, which would be 48 fps). The half
		// millisecond absorbs rAF jitter on 60 Hz screens.
		const interval = moving ? MOTION_FRAME_MS : HOLD_FRAME_MS;
		if (now - this.lastFrame < interval - 0.5) return false;
		this.lastFrame = Math.max(this.lastFrame + interval, now - interval);

		this.bindPair(from, to);
		const intro = Math.max(0, 1 - seconds / INTRO);
		this.uniforms.time.value = now / 1000;
		this.uniforms.morphTime.value = morphTime;
		this.uniforms.intro.value = intro * intro * (3 - 2 * intro);
		this.renderer.render(this.scene, this.camera);
		return true;
	}

	dispose() {
		this.disposed = true;
		this.renderer.dispose();
	}
}
