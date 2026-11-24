/**
 * Grain thumbnails for /ParticleMorphingDemo2: a variant of particleMorph.ts
 * styled after generative "data portrait" videos, where images look held
 * together by dust.
 *
 * - Each particle is a fleck, a 1-3 px dash at its own angle, not a round
 *   dot. They overlap heavily and differ only slightly in brightness, so
 *   from a distance they blend back into smooth shading and up close read
 *   as stippling or granite.
 * - The grain is always alive but calm: every fleck drifts smoothly between
 *   random nearby spots (and turns between random angles) on its own
 *   staggered cycle of roughly a second, so the surface creeps instead of
 *   flickering like TV static.
 * - Nothing has a hard outline. Flecks near the frame's edge wander outward
 *   and fade, so the image frays softly into the background.
 * - Stills do not travel into each other. Each one dissolves into an even,
 *   grainy field (every fleck flung a random distance, folded back inside
 *   the frame) and the next condenses out of it, like dust settling.
 * - Colours are muted and graded warm taupe -> cool grey -> blue-grey ->
 *   warm across the four stills.
 *
 * The particle data (positions and colours of the four stills, rank-matched
 * by colour) is the same as particleMorph.ts, prepared in the same worker.
 */
import * as THREE from 'three/webgpu';
import {
	abs,
	clamp,
	cos,
	dot,
	float,
	floor,
	fract,
	instancedBufferAttribute,
	max,
	min,
	mix,
	mod,
	sign,
	sin,
	smoothstep,
	sqrt,
	uniform,
	uv,
	varying,
	vec2,
	vec3,
	vec4
} from 'three/tsl';
import { FRAME_HEIGHT, FRAME_PADDING, FRAME_WIDTH, PARTICLE_COUNT, STILLS, type MorphData } from './morphData';
import { DISSOLVE_DELAY, DISSOLVE_MAX, DISSOLVE_MIN, HOLD, TRANSITION } from './grainTiming';
import type { Backend } from './particleMorph';

export { prepareMorph, type Backend } from './particleMorph';

/** Seconds for the first still to condense out of the noise on hover. */
const INTRO = 1.8;
/** Frame caps: a held still only creeps, the dissolve gets smooth motion. */
const HOLD_FRAME_MS = 1000 / 30;
const MOTION_FRAME_MS = 1000 / 60;

/** Sprite size in CSS px; each fleck is a dash drawn inside it. */
const SPRITE = 3.6;
/** Fleck length range and width, as fractions of the sprite. */
const FLECK_MIN = 0.4;
const FLECK_MAX = 0.9;
const FLECK_WIDTH = 0.36;

/** Drift cycles per second, per fleck, between these two rates. */
const CREEP_RATE_MIN = 0.35;
const CREEP_RATE_MAX = 0.8;
/** How far (CSS px) a fleck creeps from its place at rest... */
const CREEP = 0.9;
/** ...and the extra while it is dissolved. */
const CREEP_DISSOLVED = 3;
/** How far (CSS px) a dissolved fleck is flung from its place. */
const SCATTER = 62;
/** Width (CSS px) of the band along the frame's edge where flecks fray outward... */
const FRAY_BAND = 14;
/** ...and the farthest they wander out of it. */
const FRAY_REACH = 10;
/** Flecks fade out over this many CSS px beyond the frame. */
const FRAY_FADE = 10;

/** How much of the colour survives desaturation. */
const SATURATION = 0.45;
/** A tint per still: warm taupe, cool grey, blue-grey, back to warm. */
const TINTS: [number, number, number][] = [
	[1.04, 1.0, 0.94],
	[0.97, 0.99, 1.03],
	[0.95, 0.98, 1.04],
	[1.03, 1.0, 0.95]
];

// --- rendering ----------------------------------------------------------------

/** Where the loop is at `seconds` after the thumbnail appeared. */
function timeline(seconds: number) {
	const step = HOLD + TRANSITION;
	const cycle = seconds % (step * STILLS);
	const from = Math.floor(cycle / step);
	const local = cycle - from * step;
	return {
		from,
		to: (from + 1) % STILLS,
		/** Seconds into the transition; 0 while the still holds. */
		morphTime: local < HOLD ? 0 : local - HOLD
	};
}

/* eslint-disable @typescript-eslint/no-explicit-any -- TSL node types do not compose well in TS. */
/** A cheap trig-free hash (Dave Hoskins' hash12), 0-1. */
function hash(p: any): any {
	const p3 = fract(vec3(p.x, p.y, p.x).mul(0.1031));
	const q = p3.add(dot(p3, p3.yzx.add(33.33)));
	return fract(q.x.add(q.y).mul(q.z));
}

/**
 * Value noise in time: a random value per cycle of `clock`, eased from one
 * cycle's value into the next, so it wanders smoothly instead of jumping.
 */
function wander(clock: any, seedA: any, seedB: any): any {
	const step = floor(clock);
	const t = smoothstep(0, 1, fract(clock));
	const a = hash(vec2(seedA.add(step.mul(0.713)), seedB));
	const b = hash(vec2(seedA.add(step.add(1).mul(0.713)), seedB));
	return mix(a, b, t);
}

export class GrainMorph {
	backend: Backend | null = null;

	private renderer: THREE.WebGPURenderer;
	private scene = new THREE.Scene();
	private camera: THREE.OrthographicCamera;
	private fromStill: THREE.InstancedBufferAttribute;
	private toStill: THREE.InstancedBufferAttribute;
	private data: MorphData | null = null;
	private boundPair = -1;
	private uniforms = {
		time: uniform(0),
		seed: uniform(0),
		morphTime: uniform(0),
		intro: uniform(1),
		tintFrom: uniform(new THREE.Vector3(...TINTS[0])),
		tintTo: uniform(new THREE.Vector3(...TINTS[1]))
	};
	private startedAt = 0;
	private lastFrame = -Infinity;
	private disposed = false;

	/** `forceWebGL` skips WebGPU, to try the fallback on a browser that has it. */
	constructor(canvas: HTMLCanvasElement, { forceWebGL = false } = {}) {
		const width = FRAME_WIDTH + FRAME_PADDING * 2;
		const height = FRAME_HEIGHT + FRAME_PADDING * 2;

		this.renderer = new THREE.WebGPURenderer({ canvas, antialias: false, alpha: true, forceWebGL });
		this.renderer.setPixelRatio(Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
		this.renderer.setSize(width, height, false);
		this.renderer.setClearColor(0x000000, 0);
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
		const { time, seed, morphTime, intro, tintFrom, tintTo } = this.uniforms;
		const from = instancedBufferAttribute(this.fromStill);
		const to = instancedBufferAttribute(this.toStill);
		// x: start delay, y/w: duration, z: phase; all also seed the hashes.
		const rnd = instancedBufferAttribute(randomAttribute);
		const TAU = Math.PI * 2;
		const half = vec2(FRAME_WIDTH / 2, FRAME_HEIGHT / 2);

		// Each particle breaks up at its own moment and takes its own time to
		// re-form, so the noise field rises and settles unevenly.
		const delay = rnd.x.mul(DISSOLVE_DELAY);
		const duration = fract(rnd.y.mul(7.13).add(rnd.w.mul(3.71)))
			.mul(DISSOLVE_MAX - DISSOLVE_MIN)
			.add(DISSOLVE_MIN);
		const eased = smoothstep(0, 1, clamp(morphTime.sub(delay).div(duration), 0, 1));
		// Rises, plateaus as noise for a while, then falls into the next still.
		// The intro is the same thing, condensing out of the field on hover.
		const dissolve = max(smoothstep(0, 0.34, eased).mul(smoothstep(1, 0.66, eased)), intro);

		// Where it would be without the noise: on its way between the stills.
		const home = mix(from.xy, to.xy, eased);

		// Dissolved: flung a random distance in a random direction (new for
		// every transition), slowly swirling, and folded back at the frame's
		// edges so the field stays even rather than emptying out.
		const fling = hash(vec2(rnd.z.mul(977).add(seed), rnd.w.mul(631)));
		const reach = hash(vec2(rnd.y.mul(853), rnd.x.mul(419).add(seed)));
		const flingAngle = fling.mul(TAU).add(time.mul(reach.sub(0.5).mul(0.4)));
		const flung = home.add(vec2(cos(flingAngle), sin(flingAngle)).mul(sqrt(reach).mul(SCATTER).mul(dissolve)));
		const placed = sign(flung).mul(min(abs(flung), half.mul(2).sub(abs(flung))));

		// The grain: each fleck wanders smoothly on its own clock, so the
		// surface is never still but never flickers either.
		const clock = time
			.mul(rnd.z.mul(CREEP_RATE_MAX - CREEP_RATE_MIN).add(CREEP_RATE_MIN))
			.add(rnd.x.mul(17));
		const wx = wander(clock, rnd.x.mul(1013), rnd.z.mul(517));
		const wy = wander(clock, rnd.w.mul(389), rnd.y.mul(761));
		const ws = wander(clock.mul(0.6), rnd.y.mul(211), rnd.x.mul(97));
		const creep = vec2(wx, wy).sub(0.5).mul(2).mul(dissolve.mul(CREEP_DISSOLVED).add(CREEP));

		// Near the frame's edge, flecks also wander outward, most only a
		// little and a few farther, so the outline frays softly.
		const toEdge = half.sub(abs(placed));
		const fray = vec2(
			float(1).sub(smoothstep(0, FRAY_BAND, toEdge.x)),
			float(1).sub(smoothstep(0, FRAY_BAND, toEdge.y))
		);
		const outward = sign(placed).mul(fray).mul(ws.mul(ws).mul(FRAY_REACH));
		// A slow drift of the whole picture, like a hand-held close-up.
		const drift = vec2(sin(time.mul(0.13)), cos(time.mul(0.11))).mul(1.6);
		const position = placed.add(creep).add(outward).add(drift);

		// Colour: the stills' colours, muted and graded per still.
		const unpack = (packed: any) =>
			vec3(floor(packed.div(65536)), mod(floor(packed.div(256)), 256), mod(packed, 256)).div(255);
		const raw = mix(unpack(from.z), unpack(to.z), eased);
		const luma = dot(raw, vec3(0.2126, 0.7152, 0.0722));
		const graded = mix(vec3(luma), raw, SATURATION).mul(mix(tintFrom, tintTo, eased));
		// Flecks differ a little in brightness: low contrast against each
		// other, so they blend from a distance.
		const colour = graded.mul(rnd.w.mul(0.14).add(0.93));

		const beyond = max(abs(position).sub(half), vec2(0));
		const alpha = smoothstep(FRAY_FADE, 0, max(beyond.x, beyond.y))
			.mul(float(0.95).sub(intro.mul(intro).mul(0.6)))
			.mul(float(1).sub(dissolve.mul(0.12)));
		const tint = varying(vec4(colour, alpha));
		// The fleck's angle turns slowly along with its drift.
		const angle = rnd.y.mul(Math.PI).add(ws.sub(0.5).mul(1.2));
		const fleck = varying(
			vec3(cos(angle), sin(angle), rnd.z.mul(FLECK_MAX - FLECK_MIN).add(FLECK_MIN).mul(0.5))
		);

		const material = new THREE.PointsNodeMaterial({ transparent: true, depthTest: false, depthWrite: false });
		material.alphaToCoverage = false;
		material.positionNode = vec3(position, 0);
		material.sizeNode = float(SPRITE).mul(rnd.w.mul(0.3).add(0.85));

		// A dash through the sprite at the fleck's angle, softly edged.
		const p = uv().sub(0.5);
		const along = abs(dot(p, fleck.xy));
		const across = abs(dot(p, vec2(fleck.y.negate(), fleck.x)));
		const dash = smoothstep(fleck.z, fleck.z.sub(0.14), along).mul(
			smoothstep(FLECK_WIDTH / 2, FLECK_WIDTH / 2 - 0.14, across)
		);
		material.colorNode = vec4(tint.xyz, tint.w.mul(dash));
		return material;
	}
	/* eslint-enable @typescript-eslint/no-explicit-any */

	async init(): Promise<Backend> {
		await this.renderer.init();
		const backend = this.renderer.backend as { isWebGPUBackend?: boolean };
		this.backend = backend.isWebGPUBackend ? 'webgpu' : 'webgl2';
		await this.renderer.compileAsync(this.scene, this.camera);
		return this.backend;
	}

	/** Swaps in an article's stills and restarts its loop from the noise. */
	show(data: MorphData) {
		this.data = data;
		this.boundPair = -1;
		this.startedAt = performance.now();
		this.lastFrame = -Infinity;
	}

	/** Uploads the pair of stills the loop is between, once per transition. */
	private bindPair(from: number, to: number) {
		if (!this.data || this.boundPair === from) return;
		this.fromStill.array.set(this.data[from]);
		this.toStill.array.set(this.data[to]);
		this.fromStill.needsUpdate = true;
		this.toStill.needsUpdate = true;
		this.uniforms.seed.value = Math.random() * 100;
		this.uniforms.tintFrom.value.set(...TINTS[from]);
		this.uniforms.tintTo.value.set(...TINTS[to]);
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
		const interval = moving ? MOTION_FRAME_MS : HOLD_FRAME_MS;
		if (now - this.lastFrame < interval - 0.5) return false;
		this.lastFrame = Math.max(this.lastFrame + interval, now - interval);

		this.bindPair(from, to);
		const intro = Math.max(0, 1 - seconds / INTRO);
		this.uniforms.time.value = seconds % 1000;
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
