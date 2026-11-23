<script lang="ts">
	/**
	 * The homepage node field: one node per article, floating in space above
	 * the search bar.
	 *
	 * A Svelte/three.js port of the prototype's ThreeSketch canvas. The
	 * prototype builds it with react-three-fiber and drei; this repo already
	 * has plain three.js (see NodeSphere.svelte, which the menu still uses), so
	 * the scene is written directly against the library rather than pulling in
	 * a renderer abstraction.
	 *
	 * Three deliberate departures from the prototype, all because a node here
	 * means something and there are ~300 of them rather than 30:
	 *
	 *   - Positions come from a seeded PRNG keyed on the article id, so a given
	 *     article keeps its place in the field across reloads.
	 *   - The whole field is one instanced draw call. A THREE.Sprite each — the
	 *     obvious way, and what NodeSphere does with its 200 — costs a draw
	 *     call, a material and an object matrix per node, plus a transparency
	 *     sort over all of them every frame. At this many nodes that is most of
	 *     the frame on integrated graphics, so the quad below is billboarded in
	 *     the vertex shader instead, exactly the way a sprite is.
	 *   - The tooltip is a single DOM element that this component moves each
	 *     frame, rather than one overlay per node. Only ever one is visible.
	 */
	import { onMount, untrack } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import type { Article } from '$lib/data/articles';
	import { loadRelated, relatedFor } from '$lib/data/related';
	import { squircle } from '$lib/utils/squircle';
	import { AREAS, OTHER_AREA, areaFor, type Area, type AreaId } from '$lib/data/areas';

	let {
		articles,
		paused = false,
		interactive = true,
		selectedId = null,
		hoveredId = $bindable(null),
		anchor = null,
		clusterArea = null,
		onselect,
		onclusterarea
	}: {
		/**
		 * When set, the field gathers into one cluster per research area, laid
		 * out on a ring, with this area's cluster turned to the front.
		 */
		clusterArea?: AreaId | null;
		/** A cluster was clicked, or the ring was dragged round to another. */
		onclusterarea?: (id: AreaId) => void;
		articles: Article[];
		paused?: boolean;
		/**
		 * Whether nodes answer the pointer at all. False while the search
		 * transcript owns the screen: a result there is already the way into an
		 * article, so lighting a node up behind it only offers a click that
		 * never lands.
		 */
		interactive?: boolean;
		selectedId?: string | null;
		hoveredId?: string | null;
		/** Element parked on the active node each frame; holds the tooltip. */
		anchor?: HTMLElement | null;
		onselect?: (id: string | null) => void;
	} = $props();

	const PARAMS = {
		// Larger than the prototype's 40³ because there are nearly ten times as
		// many nodes; this keeps the field about as sparse as the design.
		width: 72,
		height: 72,
		depth: 72,
		nodeSize: 1
	};

	const BACKGROUND = 0xe8e8e8;
	const NODE_COLOR = '#050505';
	const DIM_OPACITY = 0.25;
	const HOVER_SCALE = 1.3;
	/** On-screen size of the selected node's square once the camera settles. */
	const SELECTED_NODE_PX = 56;
	/** Corner radius of the selected node, matching the thumbnail beside it. */
	const SELECTED_NODE_RADIUS_PX = 15;
	/**
	 * A node's drawn size is its world size under perspective, so the nearest
	 * ones are already the largest on screen and the hover growth reads as a
	 * lurch rather than a highlight. Nodes in the front quarter of the field's
	 * depth keep their size; the growth fades in across the band above, so a
	 * node drifting past the boundary while hovered does not pop.
	 */
	const HOVER_SCALE_NEAR_ZONE = 0.25;
	const HOVER_SCALE_FULL_ZONE = 0.45;
	/**
	 * The field travels by turning about the vertical axis through the centre,
	 * node by node, rather than by orbiting the camera: a single node can only
	 * be held still under the cursor if the motion belongs to the nodes
	 * themselves. 0.021 rad/s is what the camera's old auto-rotate came to at
	 * `autoRotateSpeed` 0.2, so the field drifts at the same pace as before.
	 */
	const ORBIT_SPEED = 0.021;
	/** How quickly a node comes to rest under the cursor, and picks up again. */
	const FREEZE_RATE = 6;
	/** How quickly a node commits to its detour around the held node. */
	const COURSE_RATE = 2.2;
	/**
	 * How near a node has to come to the held one to give it any room at all,
	 * as a distance across the field rather than an angle: a fixed angle is an
	 * enormous arc out at the rim and next to nothing near the axis, so nodes
	 * ended up holding a detour for a minute at a stretch.
	 */
	const AVOID_RANGE = 9;
	/** Vertical clearance a node opens up to pass the held one. */
	const AVOID_CLEARANCE = 3;
	/** World-space radius of a node's hit area, projected to pixels per frame. */
	const HOVER_HIT_WORLD_RADIUS = 1.5;
	const FOCUS_DISTANCE = 14;
	/** Roughly the opening camera distance, so closing returns to the first view. */
	const REST_DISTANCE = 111;
	/** Furthest the scroll wheel can pull the camera back from the field. */
	const MAX_ZOOM_OUT_DISTANCE = 200;
	const MOBILE_BREAKPOINT_PX = 900;
	const PANEL_OCCUPIED_WIDTH_PX = 745;
	const MOBILE_NODE_TARGET_Y_PX = 188;
	/** A press that travels further than this is an orbit drag, not a click. */
	const CLICK_SLOP_PX = 5;

	/**
	 * Drawing-buffer scale. Pixels are what a weak GPU runs out of first, and
	 * the field is soft dark blobs on flat grey — it loses very little by being
	 * drawn at less than the display's own resolution, and 2x on a dense screen
	 * is nearly twice the fragments of 1.5x for no visible gain here.
	 */
	const PIXEL_RATIO_CAP = 1.5;
	const PIXEL_RATIO_FLOOR = 0.75;
	const PIXEL_RATIO_STEP = 0.25;
	/** Frames are timed in windows this long before the scale is reconsidered. */
	const RESOLUTION_WINDOW_FRAMES = 45;
	/** Average frame time that means the machine is not keeping up (~48fps). */
	const SLOW_FRAME_MS = 21;
	/** Average frame time with room to spare, so resolution can go back up. */
	const FAST_FRAME_MS = 12;
	/** Consecutive comfortable windows before stepping back up, so it settles. */
	const RESOLUTION_RECOVERY_WINDOWS = 4;
	/** Longest a cached hit test of what is over the cursor is trusted. */
	const POINTER_BLOCK_CHECK_MS = 150;
	/** How far a string bows out of true, as a share of its on-screen length. */
	const STRING_BEND = 0.16;
	/** Clearance between a related title and its node, or another title. */
	const LABEL_GAP_PX = 8;
	/** Closest a related title may come to the edge of the window. */
	const LABEL_EDGE_PX = 8;
	/** Highest a related title may sit, clear of the header drawn over the field. */
	const LABEL_TOP_PX = 88;
	const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

	// --- clustered view ----------------------------------------------------

	/** Radius of the ring the area clusters sit on. */
	const RING_RADIUS = 78;
	/** A cluster's radius grows with the cube root of its size, so density holds. */
	const CLUSTER_SPREAD = 2.6;
	/** How far the clusters rise and fall around the ring, for a less rigid galaxy. */
	const RING_WAVE = 6;
	/** Seconds for the field to gather into clusters, or scatter back. */
	const CLUSTER_TRANSITION_S = 1.6;
	/** Share of the transition spent staggering nodes, so they don't all leave at once. */
	const CLUSTER_STAGGER = 0.4;
	/** Each cluster turns slowly on its own axis, so it stays alive while you look. */
	const CLUSTER_SPIN = 0.06;
	/** How quickly the ring turns to bring a cluster to the front. */
	const RING_TURN_RATE = 3.2;
	/** Ring rotation per pixel dragged. */
	const DRAG_YAW_PER_PX = 0.0045;
	const DRAG_ELEVATION_PER_PX = 0.004;
	/** How quickly a flicked ring slows, and below which speed it settles on a cluster. */
	const RING_FRICTION = 3.5;
	const RING_SETTLE_SPEED = 0.25;
	const CLUSTER_VIEW_DISTANCE = 54;
	const CLUSTER_VIEW_MIN_DISTANCE = 18;
	const CLUSTER_VIEW_MAX_DISTANCE = 170;
	const CLUSTER_ELEVATION = 0.3;
	const CLUSTER_MIN_ELEVATION = -0.2;
	const CLUSTER_MAX_ELEVATION = 1.25;
	const CAMERA_RIG_RATE = 3;
	/** Nodes of clusters away from the front fade back, so the front one reads first. */
	const BACK_CLUSTER_OPACITY = 0.28;
	const SIDE_CLUSTER_OPACITY = 0.7;

	type ClusterLayout = {
		area: Area;
		count: number;
		/** Where on the ring it sits, before the ring's own rotation. */
		theta: number;
		y: number;
		radius: number;
	};

	/** One cluster per area that has articles, in AREAS' ring order. */
	function buildClusterLayout(list: Article[]) {
		const counts = new Map<AreaId, number>();
		for (const article of list) {
			const id = areaFor(article).id;
			counts.set(id, (counts.get(id) ?? 0) + 1);
		}
		const present = [...AREAS, OTHER_AREA].filter((area) => counts.has(area.id));
		return present.map<ClusterLayout>((area, i) => {
			const count = counts.get(area.id)!;
			return {
				area,
				count,
				theta: (Math.PI * 2 * i) / present.length,
				y: Math.sin(i * 2.1) * RING_WAVE,
				radius: CLUSTER_SPREAD * Math.cbrt(count) + 1
			};
		});
	}

	// Built once, like the nodes themselves: the corpus doesn't change under a mounted field.
	// svelte-ignore state_referenced_locally
	const clusterLayout = buildClusterLayout(articles);
	const clusterIndexByArea = new Map(clusterLayout.map((cluster, i) => [cluster.area.id, i]));

	const clusterLabelEls = $state<(HTMLButtonElement | undefined)[]>([]);
	/** The cluster under the cursor (or its title), for the title's emphasis. */
	let hoveredClusterIndex = $state<number | null>(null);
	/** The cluster at the front of the ring. */
	let focusedClusterIndex = $state(0);
	/** Set by the titles themselves, which sit over the canvas and hide it from the hit test. */
	let labelHoverIndex: number | null = null;
	/** Whether the clusters are gathered enough for their titles to take the pointer. */
	let clusterLabelsLive = $state(false);
	/** Called by a title; set up inside onMount, where the ring lives. */
	let focusClusterFromLabel: (index: number) => void = () => {};

	let container = $state<HTMLDivElement>();

	// --- strings to the hovered node's related articles -----------------------

	/** One slot per related article, each list holding at most three. */
	const LINK_SLOTS = [0, 1, 2];

	const stringEls = $state<(SVGPathElement | undefined)[]>([]);
	const labelEls = $state<(HTMLDivElement | undefined)[]>([]);
	const labelCardEls = $state<(HTMLDivElement | undefined)[]>([]);

	let relatedReady = $state(false);
	const linksVisible = $derived(!!hoveredId && !selectedId);

	// Outlives the hover, so the strings still have their titles as they fade.
	let linkedId = $state<string | null>(null);
	$effect(() => {
		if (!linksVisible) return;
		linkedId = hoveredId;
		loadRelated().then(() => (relatedReady = true));
	});

	const links = $derived(
		relatedReady && linkedId ? relatedFor(linkedId).map(({ article }) => article) : []
	);
	/** Spared the dimming, so each string lands on a node you can actually see. */
	const litIds = $derived(new Set(linksVisible ? links.map((article) => article.id) : []));

	// Each string draws out from the hovered node, with its title following.
	$effect(() => {
		if (!linksVisible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		for (let i = 0; i < links.length; i++) {
			stringEls[i]?.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
				duration: 900,
				delay: i * 70,
				easing: EASE_OUT_EXPO,
				fill: 'backwards'
			});
			labelCardEls[i]?.animate(
				[
					{ opacity: 0, transform: 'translateY(6px)' },
					{ opacity: 1, transform: 'none' }
				],
				{ duration: 500, delay: 250 + i * 70, easing: EASE_OUT_EXPO, fill: 'backwards' }
			);
		}
	});

	/**
	 * Titles only change size when their text does, so they are measured then
	 * rather than read back from the layout every frame.
	 */
	const labelSizes = LINK_SLOTS.map(() => ({ width: 0, height: 0 }));
	function measureLabels() {
		for (const i of LINK_SLOTS) {
			labelSizes[i].width = labelEls[i]?.offsetWidth ?? 0;
			labelSizes[i].height = labelEls[i]?.offsetHeight ?? 0;
		}
	}
	$effect(() => {
		void links;
		measureLabels();
	});
	// Measurements taken before the font loads are against the fallback.
	$effect(() => {
		document.fonts?.ready.then(measureLabels);
	});

	/** Deterministic positions: same article, same corner of the field. */
	function seedFrom(id: string): number {
		let hash = 0x811c9dc5;
		for (let i = 0; i < id.length; i++) {
			hash ^= id.charCodeAt(i);
			hash = Math.imul(hash, 0x01000193);
		}
		return hash >>> 0;
	}

	function mulberry32(seed: number) {
		let a = seed;
		return () => {
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	/** Frame-rate independent approach to `target`; `rate` is per second. */
	function ease(current: number, target: number, rate: number, dt: number) {
		return current + (target - current) * (1 - Math.exp(-rate * dt));
	}

	function createSquircleTexture() {
		const size = 128;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d')!;
		const r = size * 0.45;
		const n = 4.5;
		const steps = 64;
		const center = size / 2;
		ctx.fillStyle = NODE_COLOR;
		ctx.beginPath();
		for (let i = 0; i <= steps; i++) {
			const t = (Math.PI * 2 * i) / steps;
			const ct = Math.cos(t);
			const st = Math.sin(t);
			const x = center + r * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
			const y = center + r * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.fill();
		return new THREE.CanvasTexture(canvas);
	}

	/**
	 * The selected node's shape: a square with the thumbnail's corners, i.e.
	 * what `squircle({ radius: 8 })` clips a SELECTED_NODE_PX box to. Same
	 * superellipse sweep as that action, slid onto each corner's centre.
	 */
	function createSelectedTexture() {
		const size = 128;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d')!;
		// The shape fills 0.9 of the quad, like the field's texture, so the
		// scale maths for SELECTED_NODE_PX holds for both.
		const half = size * 0.45;
		const r = (half * SELECTED_NODE_RADIUS_PX) / (SELECTED_NODE_PX / 2);
		const n = 4.5;
		const steps = 96;
		const center = size / 2;
		ctx.fillStyle = NODE_COLOR;
		ctx.beginPath();
		for (let i = 0; i <= steps; i++) {
			const t = (Math.PI * 2 * i) / steps;
			const ct = Math.cos(t);
			const st = Math.sin(t);
			const ux = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
			const uy = Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
			const cx = center + (ux >= 0 ? half - r : r - half);
			const cy = center + (uy >= 0 ? half - r : r - half);
			if (i === 0) ctx.moveTo(cx + r * ux, cy + r * uy);
			else ctx.lineTo(cx + r * ux, cy + r * uy);
		}
		ctx.fill();
		return new THREE.CanvasTexture(canvas);
	}

	onMount(() => {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(BACKGROUND);

		const camera = new THREE.PerspectiveCamera(
			55,
			container!.clientWidth / container!.clientHeight,
			1,
			3000
		);
		camera.position.set(70, 48, 70);

		// No multisampling: every edge in this scene is the squircle texture's
		// own alpha, and the quads carrying it are invisible, so there is no
		// geometry for MSAA to smooth — only a fullscreen resolve to pay for.
		const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
		let pixelRatio = Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP);
		renderer.setPixelRatio(pixelRatio);
		renderer.setSize(container!.clientWidth, container!.clientHeight);
		container!.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.enableZoom = true;
		controls.maxDistance = MAX_ZOOM_OUT_DISTANCE;
		controls.enablePan = true;
		controls.mouseButtons.RIGHT = null;
		renderer.domElement.removeEventListener(
			'contextmenu',
			(controls as unknown as { _onContextMenu: (e: Event) => void })._onContextMenu
		);

		const texture = createSquircleTexture();
		const selectedTexture = createSelectedTexture();

		type Node = {
			id: string;
			/** Live world position, kept for the hit test, tooltip and focus. */
			position: THREE.Vector3;
			/** Where the node sits in its orbit about the centre's vertical axis. */
			radius: number;
			angle: number;
			/** The height it travels at when nothing is in its way. */
			baseY: number;
			/** 1 while travelling, 0 while held still under the cursor. */
			spin: number;
			/** Current detour off `baseY`, in world units. */
			yOffset: number;
			/** Index into clusterLayout: the node's research area. */
			cluster: number;
			/** Its place in that cluster, which turns about its own vertical axis. */
			localRadius: number;
			localAngle: number;
			localY: number;
			/** 0–1: how late this node sets off when the field gathers or scatters. */
			delay: number;
		};

		const nodes: Node[] = articles.map((article) => {
			const random = mulberry32(seedFrom(article.id));
			const x = (random() - 0.5) * PARAMS.width;
			const y = (random() - 0.5) * PARAMS.height;
			const z = (random() - 0.5) * PARAMS.depth;

			// A point in the cluster's ball: cube root on the distance keeps the
			// ball evenly filled rather than bunched at its centre.
			const cluster = clusterIndexByArea.get(areaFor(article).id) ?? 0;
			const reach = clusterLayout[cluster].radius * Math.cbrt(0.08 + 0.92 * random());
			const polar = Math.acos(2 * random() - 1);
			return {
				id: article.id,
				position: new THREE.Vector3(x, y, z),
				radius: Math.hypot(x, z),
				angle: Math.atan2(z, x),
				baseY: y,
				spin: 1,
				yOffset: 0,
				cluster,
				localRadius: reach * Math.sin(polar),
				localAngle: random() * Math.PI * 2,
				localY: reach * Math.cos(polar),
				delay: random()
			};
		});

		// --- clusters -----------------------------------------------------

		type Cluster = ClusterLayout & {
			/** Live world centre, after the ring's rotation. */
			center: THREE.Vector3;
			/** 1 at the front of the ring (facing the camera), -1 at the back. */
			front: number;
			/** On-screen centre and radius, for the cluster hit test. */
			screenX: number;
			screenY: number;
			screenRadius: number;
			onScreen: boolean;
			/** Last opacity written to its title, so unchanged ones are skipped. */
			labelOpacity: number;
		};

		const clusters: Cluster[] = clusterLayout.map((layout) => ({
			...layout,
			center: new THREE.Vector3(),
			front: 0,
			screenX: 0,
			screenY: 0,
			screenRadius: 0,
			onScreen: false,
			labelOpacity: -1
		}));

		/** 0 = the free field, 1 = fully gathered. Moves linearly; nodes ease it. */
		let clusterMix = 0;
		let clusterTarget = 0;
		/** The ring's rotation, and where it is turning to. */
		let ringYaw = 0;
		let ringYawTarget = 0;
		/** Spin left on the ring after a flick, in rad/s. Null when not coasting. */
		let ringVelocity: number | null = null;
		/** Azimuth the camera looks in from; the cluster here is "the front". */
		let frontAngle = 0;
		let focusedCluster = 0;
		let clusterDistance = CLUSTER_VIEW_DISTANCE;
		let clusterElevation = CLUSTER_ELEVATION;
		let drag: {
			x: number;
			y: number;
			time: number;
			velocity: number;
			/** Past the click slop, so letting go should coast and settle. */
			moved: boolean;
		} | null = null;
		const clustered = () => clusterTarget === 1;

		/** The equivalent of `angle` nearest `current`, so the ring takes the short way. */
		function nearestTurn(angle: number, current: number) {
			const turn = Math.PI * 2;
			return angle + turn * Math.round((current - angle) / turn);
		}

		function turnTo(index: number) {
			focusedCluster = index;
			focusedClusterIndex = index;
			ringYawTarget = nearestTurn(frontAngle - clusters[index].theta, ringYaw);
			ringVelocity = null;
		}

		/** Bring a cluster to the front, telling the page so its state agrees. */
		function focusCluster(index: number) {
			turnTo(index);
			const id = clusters[index].area.id;
			if (id !== clusterArea) onclusterarea?.(id);
		}
		focusClusterFromLabel = focusCluster;

		/** The cluster nearest the front once the ring has been dragged round. */
		function frontmostCluster() {
			let best = 0;
			for (let i = 1; i < clusters.length; i++) {
				if (clusters[i].front > clusters[best].front) best = i;
			}
			return best;
		}

		const nodeById = new Map(nodes.map((node) => [node.id, node]));

		/** How far the outermost node sits from the centre the camera orbits. */
		const fieldRadius = nodes.reduce((max, node) => Math.max(max, node.position.length()), 1);

		// --- the field, as one draw call ------------------------------------

		const count = nodes.length;
		const geometry = new THREE.InstancedBufferGeometry();
		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3)
		);
		geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
		geometry.setIndex([0, 1, 2, 0, 2, 3]);

		const offsets = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
		const scales = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
		const opacities = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
		offsets.setUsage(THREE.DynamicDrawUsage);
		scales.setUsage(THREE.DynamicDrawUsage);
		opacities.setUsage(THREE.DynamicDrawUsage);
		const offsetArray = offsets.array as Float32Array;
		const scaleArray = scales.array as Float32Array;
		const opacityArray = opacities.array as Float32Array;
		for (let i = 0; i < count; i++) {
			offsetArray[i * 3] = nodes[i].position.x;
			offsetArray[i * 3 + 1] = nodes[i].position.y;
			offsetArray[i * 3 + 2] = nodes[i].position.z;
			scaleArray[i] = PARAMS.nodeSize;
			opacityArray[i] = 1;
		}
		geometry.setAttribute('aOffset', offsets);
		geometry.setAttribute('aScale', scales);
		geometry.setAttribute('aOpacity', opacities);
		geometry.instanceCount = count;

		const material = new THREE.ShaderMaterial({
			uniforms: { map: { value: texture } },
			// Billboarding by hand: the quad is offset in view space, so it
			// always faces the camera and keeps its world size, which is what a
			// Sprite does — for the price of one draw call rather than 300.
			vertexShader: `
				attribute vec3 aOffset;
				attribute float aScale;
				attribute float aOpacity;
				varying vec2 vUv;
				varying float vOpacity;
				void main() {
					vUv = uv;
					vOpacity = aOpacity;
					vec4 viewPosition = modelViewMatrix * vec4(aOffset, 1.0);
					viewPosition.xy += position.xy * aScale;
					gl_Position = projectionMatrix * viewPosition;
				}
			`,
			// The texture is a 2D canvas, so its texels already are the sRGB
			// values the node is meant to end up as, and a ShaderMaterial does
			// no conversion of its own on the way out. They are passed straight
			// through: encoding them again is what used to lift the node's
			// #050505 to roughly #242424, so a selected node never matched the
			// black of the pills beside it.
			fragmentShader: `
				uniform sampler2D map;
				varying vec2 vUv;
				varying float vOpacity;
				void main() {
					vec4 texel = texture2D(map, vUv);
					float alpha = texel.a * vOpacity;
					if (alpha < 0.004) discard;
					gl_FragColor = vec4(texel.rgb, alpha);
				}
			`,
			transparent: true,
			// Nothing else is in the scene and every node is the same flat
			// colour, so depth buys nothing here: blending identical colours
			// comes out the same whatever order they arrive in, which is also
			// why the field needs no per-node sort.
			depthTest: false,
			depthWrite: false
		});

		const field = new THREE.Mesh(geometry, material);
		field.frustumCulled = false;
		scene.add(field);

		// The field is one unsorted, depth-less draw call, so a dimmed node that
		// happens to come later in the buffer blends its grey over the selected
		// one and washes it out. Drawing the selected node a second time, on
		// top, is what keeps it reading as solid black while the panel is open.
		const highlightGeometry = new THREE.InstancedBufferGeometry();
		highlightGeometry.setAttribute('position', geometry.getAttribute('position'));
		highlightGeometry.setAttribute('uv', geometry.getAttribute('uv'));
		highlightGeometry.setIndex(geometry.getIndex());
		const highlightOffset = new THREE.InstancedBufferAttribute(new Float32Array(3), 3);
		const highlightScale = new THREE.InstancedBufferAttribute(new Float32Array(1), 1);
		const highlightOpacity = new THREE.InstancedBufferAttribute(new Float32Array([1]), 1);
		highlightOffset.setUsage(THREE.DynamicDrawUsage);
		highlightScale.setUsage(THREE.DynamicDrawUsage);
		highlightGeometry.setAttribute('aOffset', highlightOffset);
		highlightGeometry.setAttribute('aScale', highlightScale);
		highlightGeometry.setAttribute('aOpacity', highlightOpacity);
		highlightGeometry.instanceCount = 1;

		// Its own copy of the material so it can carry the thumbnail-cornered
		// texture; the field's squircle underneath sits wholly inside it.
		const highlightMaterial = material.clone();
		highlightMaterial.uniforms.map.value = selectedTexture;
		const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
		highlight.frustumCulled = false;
		highlight.renderOrder = 1;
		highlight.visible = false;
		scene.add(highlight);

		// --- pointer ------------------------------------------------------

		let pointer: { x: number; y: number } | null = null;
		let pressedAt: { x: number; y: number } | null = null;
		let pointerMoved = false;

		const onPointerMove = (event: PointerEvent) => {
			pointer = { x: event.clientX, y: event.clientY };
			pointerMoved = true;

			// In the clustered view a held drag turns the ring itself, rather
			// than orbiting the camera, and tilts the view up or down.
			if (drag) {
				const now = performance.now();
				const dx = event.clientX - drag.x;
				const dy = event.clientY - drag.y;
				const turn = dx * DRAG_YAW_PER_PX;
				ringYaw += turn;
				ringYawTarget = ringYaw;
				const elapsed = Math.max(1, now - drag.time) / 1000;
				drag.velocity = THREE.MathUtils.lerp(drag.velocity, turn / elapsed, 0.5);
				clusterElevation = THREE.MathUtils.clamp(
					clusterElevation + dy * DRAG_ELEVATION_PER_PX,
					CLUSTER_MIN_ELEVATION,
					CLUSTER_MAX_ELEVATION
				);
				drag.x = event.clientX;
				drag.y = event.clientY;
				drag.time = now;
				if (
					pressedAt &&
					Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y) > CLICK_SLOP_PX
				) {
					drag.moved = true;
				}
			}
		};
		const onPointerLeave = () => {
			pointer = null;
		};
		const onPointerDown = (event: PointerEvent) => {
			pressedAt = { x: event.clientX, y: event.clientY };
			returning = false;
			if (clustered() && !selectedId && event.button === 0) {
				drag = {
					x: event.clientX,
					y: event.clientY,
					time: performance.now(),
					velocity: 0,
					moved: false
				};
				ringVelocity = null;
			}
		};
		const onPointerUp = (event: PointerEvent) => {
			if (!pressedAt) return;
			const travelled = Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y);
			pressedAt = null;
			// Releasing after an orbit drag should not open whatever happens to
			// be under the cursor.
			if (travelled > CLICK_SLOP_PX) return;
			// A click on a cluster other than the front one brings it forward;
			// only the front cluster's nodes answer the pointer individually.
			if (
				!hoveredId &&
				clustered() &&
				!selectedId &&
				hoveredClusterIndex !== null &&
				hoveredClusterIndex !== focusedCluster
			) {
				focusCluster(hoveredClusterIndex);
				return;
			}
			onselect?.(hoveredId);
		};
		/** Let go of the ring: a flick coasts on, then settles on a cluster. */
		const onDragEnd = () => {
			if (!drag) return;
			// A plain click never turned the ring, so there is nothing to settle;
			// leave whatever the click itself asked for alone.
			if (drag.moved) {
				const recent = performance.now() - drag.time < 80;
				ringVelocity = recent ? drag.velocity : 0;
			}
			drag = null;
		};
		/** Zoom is the camera's distance from the front cluster while gathered. */
		const onWheel = (event: WheelEvent) => {
			if (!clustered() || selectedId) return;
			event.preventDefault();
			clusterDistance = THREE.MathUtils.clamp(
				clusterDistance * Math.exp(event.deltaY * 0.001),
				CLUSTER_VIEW_MIN_DISTANCE,
				CLUSTER_VIEW_MAX_DISTANCE
			);
		};

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onDragEnd);
		window.addEventListener('pointercancel', onDragEnd);
		renderer.domElement.addEventListener('pointerleave', onPointerLeave);
		renderer.domElement.addEventListener('pointerdown', onPointerDown);
		renderer.domElement.addEventListener('pointerup', onPointerUp);
		renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

		let blocked = true;
		let blockedCheckedAt = 0;

		/**
		 * Anything the visitor could click — the detail panel, the search bar,
		 * a search result card — must also swallow hover, or nodes light up
		 * through it. Hit testing the actual topmost element keeps that in step
		 * with whatever the page renders over the field: overlays that opt out
		 * of the pointer (`pointer-events: none`) let hover through, and every
		 * other one blocks it, with no list to keep up to date.
		 *
		 * The canvas sits behind the page (`-z-10`), so open space hit tests to
		 * the document itself rather than to the canvas; both mean "nothing in
		 * the way".
		 *
		 * `elementFromPoint` is a real hit test against the live layout, so the
		 * answer is cached rather than asked for every frame: it can only change
		 * when the cursor moves or the page over it does, and the second case is
		 * covered by re-asking a few times a second.
		 */
		function pointerIsBlocked(now: number): boolean {
			if (!pointer) return true;
			if (pointerMoved || now - blockedCheckedAt > POINTER_BLOCK_CHECK_MS) {
				pointerMoved = false;
				blockedCheckedAt = now;
				const top = document.elementFromPoint(pointer.x, pointer.y);
				blocked = !(
					top === renderer.domElement ||
					top === document.body ||
					top === document.documentElement
				);
			}
			return blocked;
		}

		// --- per-frame state ----------------------------------------------

		const cameraRight = new THREE.Vector3();
		const projected = new THREE.Vector3();
		const viewPosition = new THREE.Vector3();
		const edge = new THREE.Vector3();
		const desiredTarget = new THREE.Vector3();
		const scratch = new THREE.Vector3();
		/**
		 * Projection and view folded together once a frame. `Vector3.project`
		 * runs both matrices over every node it is given, so at ~300 nodes this
		 * saves 300 matrix multiplies a frame for the cost of one.
		 */
		const viewProjection = new THREE.Matrix4();

		// The canvas is `fixed inset-0`, so its box only moves when the window
		// resizes — measuring it every frame is a layout read for an answer
		// that is nearly always the same one.
		let viewLeft = 0;
		let viewTop = 0;
		let viewWidth = container!.clientWidth;
		let viewHeight = container!.clientHeight;

		let viewOffsetX = 0;
		let viewOffsetY = 0;
		let frameId = 0;
		/**
		 * Set when a node closes, cleared once the camera is back out or the
		 * visitor takes the controls. Focusing pulls the camera to within 14
		 * units of a node, which is inside the cloud; without this, closing an
		 * article leaves you staring at the middle of the field from within it.
		 */
		let returning = false;

		/** Park the tooltip anchor on whichever node is active. */
		function updateAnchor() {
			if (!anchor) return;
			const active = selectedId ?? hoveredId;
			const node = active ? nodeById.get(active) : undefined;

			if (!node) {
				if (anchor.style.visibility !== 'hidden') anchor.style.visibility = 'hidden';
				return;
			}

			projected.copy(node.position).applyMatrix4(viewProjection);
			const x = (projected.x * 0.5 + 0.5) * viewWidth;
			const y = (-projected.y * 0.5 + 0.5) * viewHeight;
			const visibility = projected.z > 1 ? 'hidden' : 'visible';
			if (anchor.style.visibility !== visibility) anchor.style.visibility = visibility;
			// Whole device pixels, and only written when they change. A transform
			// that moves every frame gets the layer treated as animating, which
			// leaves the thumbnail resampled at subpixel offsets with cheap filtering.
			const transform = `translate(${snap(x)}px, ${snap(y)}px)`;
			if (anchor.style.transform !== transform) anchor.style.transform = transform;

			// The squircle fills 0.9 of its quad, so its visible top sits 0.45
			// of the quad's scaled size above the centre. Published so the
			// tooltip can line its top up with the square's.
			const halfHeight = nodeHalfHeight(node, scaleArray[nodes.indexOf(node)]);
			const halfHeightPx = `${snap(halfHeight)}px`;
			if (anchor.style.getPropertyValue('--node-half-height') !== halfHeightPx) {
				anchor.style.setProperty('--node-half-height', halfHeightPx);
			}
		}

		/** Half the on-screen height of a node's square, in pixels. */
		function nodeHalfHeight(node: Node, scale: number) {
			const depth = -viewPosition.copy(node.position).applyMatrix4(camera.matrixWorldInverse).z;
			return depth > 0
				? (0.45 * scale * camera.projectionMatrix.elements[5] * viewHeight) / (2 * depth)
				: 0;
		}

		type Box = { x: number; y: number; w: number; h: number };

		const labelBoxes = LINK_SLOTS.map(() => ({
			el: null as HTMLElement | null,
			x: 0,
			y: 0,
			w: 0,
			h: 0
		}));
		const placedBoxes: typeof labelBoxes = [];

		/** Whether two boxes come within LABEL_GAP_PX of each other. */
		function crowds(a: Box, b: Box) {
			return (
				a.x < b.x + b.w &&
				b.x < a.x + a.w &&
				a.y < b.y + b.h + LABEL_GAP_PX &&
				b.y < a.y + a.h + LABEL_GAP_PX
			);
		}

		/** Move a title up or down until it is clear of everything in `solids`. */
		function moveClear(box: Box, solids: Box[], direction: 'up' | 'down') {
			let moved = true;
			while (moved) {
				moved = false;
				for (const solid of solids) {
					if (crowds(box, solid)) {
						box.y =
							direction === 'up'
								? solid.y - box.h - LABEL_GAP_PX
								: solid.y + solid.h + LABEL_GAP_PX;
						moved = true;
					}
				}
			}
		}

		/**
		 * Run the strings from the hovered node to its related ones, and park
		 * each title just above its node. Left as they are while fading out:
		 * nothing moves far enough in that moment to see.
		 */
		function updateLinks() {
			if (!linksVisible) return;
			const source = linkedId ? nodeById.get(linkedId) : undefined;
			if (!source) return;

			projected.copy(source.position).applyMatrix4(viewProjection);
			const sourceX = (projected.x * 0.5 + 0.5) * viewWidth;
			const sourceY = (-projected.y * 0.5 + 0.5) * viewHeight;

			// The hover card sits above this layer, so a title under it is lost.
			const tooltip: Box[] = [];
			anchor?.querySelectorAll('.link-obstacle').forEach((element) => {
				const rect = element.getBoundingClientRect();
				tooltip.push({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
			});

			placedBoxes.length = 0;
			for (const i of LINK_SLOTS) {
				const string = stringEls[i];
				const label = labelEls[i];
				if (!string || !label) continue;

				const target = links[i] ? nodeById.get(links[i].id) : undefined;
				if (target) projected.copy(target.position).applyMatrix4(viewProjection);

				// Behind the camera, where projecting a point turns it inside out.
				if (!target || projected.z > 1) {
					string.style.visibility = 'hidden';
					label.style.visibility = 'hidden';
					continue;
				}

				const x = (projected.x * 0.5 + 0.5) * viewWidth;
				const y = (-projected.y * 0.5 + 0.5) * viewHeight;

				// Bowed to alternate sides, so the three fan out from the node.
				const bend = STRING_BEND * (i % 2 ? -1 : 1);
				const controlX = (sourceX + x) / 2 - (y - sourceY) * bend;
				const controlY = (sourceY + y) / 2 + (x - sourceX) * bend;
				string.setAttribute(
					'd',
					`M${sourceX.toFixed(1)} ${sourceY.toFixed(1)}Q${controlX.toFixed(1)} ${controlY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
				);
				string.style.visibility = 'visible';

				// A string can lead off the edge; its title has nowhere to sit.
				if (x < 0 || x > viewWidth || y < 0 || y > viewHeight) {
					label.style.visibility = 'hidden';
					continue;
				}

				const { width, height } = labelSizes[i];
				const box = labelBoxes[i];
				box.el = label;
				box.w = width;
				box.h = height;
				box.x = THREE.MathUtils.clamp(
					x - width / 2,
					LABEL_EDGE_PX,
					Math.max(LABEL_EDGE_PX, viewWidth - width - LABEL_EDGE_PX)
				);
				// Above the node, unless the card is in the way and below it is free.
				const halfHeight = nodeHalfHeight(target, PARAMS.nodeSize);
				const above = y - halfHeight - LABEL_GAP_PX - height;
				box.y = above;
				if (tooltip.some((solid) => crowds(box, solid))) {
					box.y = y + halfHeight + LABEL_GAP_PX;
					if (tooltip.some((solid) => crowds(box, solid))) box.y = above;
				}
				placedBoxes.push(box);
			}

			// Lowest first, each title lifting clear of any it would land on, or
			// dropping below them if that would take it up under the header.
			placedBoxes.sort((a, b) => b.y - a.y);
			for (let i = 0; i < placedBoxes.length; i++) {
				const box = placedBoxes[i];
				const solids = [...tooltip, ...placedBoxes.slice(0, i)];
				const wanted = box.y;
				moveClear(box, solids, 'up');
				if (box.y < LABEL_TOP_PX) {
					box.y = Math.max(wanted, LABEL_TOP_PX);
					moveClear(box, solids, 'down');
				}
				const el = box.el!;
				el.style.visibility = 'visible';
				const transform = `translate(${snap(box.x)}px, ${snap(box.y)}px)`;
				if (el.style.transform !== transform) el.style.transform = transform;
			}
		}

		/** Round a CSS length onto the device pixel grid. */
		function snap(value: number) {
			const ratio = window.devicePixelRatio || 1;
			return Math.round(value * ratio) / ratio;
		}

		/**
		 * Pull the camera in on the selected node and slide it clear of the
		 * detail panel using an asymmetric view frustum, which moves the image
		 * without moving the camera or breaking the projection maths above.
		 */
		function updateFocus(lerpT: number) {
			const node = selectedId ? nodeById.get(selectedId) : undefined;
			const mobile = viewWidth < MOBILE_BREAKPOINT_PX;

			const targetOffsetX = node && !mobile ? PANEL_OCCUPIED_WIDTH_PX / 2 : 0;
			const targetOffsetY = node && mobile ? viewHeight / 2 - MOBILE_NODE_TARGET_Y_PX : 0;

			viewOffsetX = THREE.MathUtils.lerp(viewOffsetX, targetOffsetX, lerpT);
			viewOffsetY = THREE.MathUtils.lerp(viewOffsetY, targetOffsetY, lerpT);

			if (Math.abs(viewOffsetX) < 0.5 && Math.abs(viewOffsetY) < 0.5) {
				if (camera.view?.enabled) camera.clearViewOffset();
			} else {
				camera.setViewOffset(
					viewWidth,
					viewHeight,
					viewOffsetX,
					viewOffsetY,
					viewWidth,
					viewHeight
				);
			}

			if (!node && !returning) return;

			// Both the focus and the return move the same two things, just
			// towards different places: a node up close, or the origin at
			// arm's length.
			const targetDistance = node ? FOCUS_DISTANCE : REST_DISTANCE;
			if (node) desiredTarget.copy(node.position);
			else desiredTarget.set(0, 0, 0);

			controls.target.lerp(desiredTarget, lerpT);

			// Close the gap along the existing view direction, so the framing
			// the visitor had orbited to is preserved.
			const distance = camera.position.distanceTo(controls.target);
			if (node ? distance > targetDistance : distance < targetDistance) {
				const next = THREE.MathUtils.lerp(distance, targetDistance, lerpT);
				scratch.subVectors(camera.position, controls.target).setLength(next);
				camera.position.copy(controls.target).add(scratch);
			}

			if (returning && controls.target.length() < 0.5) returning = false;
		}

		/**
		 * Gather or scatter, and turn the ring: towards the front cluster,
		 * along with a drag, or coasting after a flick until it settles on
		 * whichever cluster is nearest the front.
		 */
		function updateClusters(dt: number) {
			if (clusterMix !== clusterTarget) {
				const step = dt / CLUSTER_TRANSITION_S;
				clusterMix =
					clusterTarget > clusterMix
						? Math.min(clusterTarget, clusterMix + step)
						: Math.max(clusterTarget, clusterMix - step);
			}
			if (clusterMix === 0) return;

			if (ringVelocity !== null && !drag) {
				ringYaw += ringVelocity * dt;
				ringYawTarget = ringYaw;
				ringVelocity *= Math.exp(-RING_FRICTION * dt);
				if (Math.abs(ringVelocity) < RING_SETTLE_SPEED) {
					// Centres are a frame old here, which is close enough to pick by.
					focusCluster(frontmostCluster());
				}
			} else if (!drag && ringYaw !== ringYawTarget) {
				ringYaw = ease(ringYaw, ringYawTarget, RING_TURN_RATE, dt);
				if (Math.abs(ringYaw - ringYawTarget) < 0.0005) ringYaw = ringYawTarget;
			}

			for (const cluster of clusters) {
				const angle = cluster.theta + ringYaw;
				cluster.center.set(Math.cos(angle) * RING_RADIUS, cluster.y, Math.sin(angle) * RING_RADIUS);
				cluster.front = Math.cos(angle - frontAngle);
			}
		}

		const rigTarget = new THREE.Vector3();
		const rigPosition = new THREE.Vector3();

		/**
		 * While gathered, the camera stands outside the ring looking in at its
		 * front, so the front cluster sits centre stage with its neighbours
		 * curving away to either side. The ring turns; the camera only tilts
		 * and zooms.
		 */
		function updateClusterRig(dt: number) {
			if (!clustered() || selectedId) return;
			const fx = Math.cos(frontAngle);
			const fz = Math.sin(frontAngle);
			rigTarget.set(fx * RING_RADIUS, clusters[focusedCluster].y, fz * RING_RADIUS);
			const flat = Math.cos(clusterElevation) * clusterDistance;
			rigPosition.set(
				rigTarget.x + fx * flat,
				rigTarget.y + Math.sin(clusterElevation) * clusterDistance,
				rigTarget.z + fz * flat
			);
			const k = 1 - Math.exp(-CAMERA_RIG_RATE * dt);
			controls.target.lerp(rigTarget, k);
			camera.position.lerp(rigPosition, k);
		}

		const labelPoint = new THREE.Vector3();

		/**
		 * Project each cluster for the hit test, and park its title just above
		 * it. Titles at the back of the ring fade; the hovered one and the
		 * front one stay solid.
		 */
		function updateClusterLabels() {
			const live = clusterMix > 0.6 && clustered() && !selectedId;
			if (live !== clusterLabelsLive) clusterLabelsLive = live;
			if (clusterMix === 0 && clusters[0].labelOpacity === 0) return;

			camera.matrixWorld.extractBasis(cameraRight, scratch, scratch);
			const appear = selectedId ? 0 : THREE.MathUtils.smoothstep(clusterMix, 0.45, 1);

			for (let i = 0; i < clusters.length; i++) {
				const cluster = clusters[i];
				const label = clusterLabelEls[i];

				projected.copy(cluster.center).applyMatrix4(viewProjection);
				cluster.onScreen = projected.z >= -1 && projected.z <= 1;
				const x = (projected.x * 0.5 + 0.5) * viewWidth;
				const y = (-projected.y * 0.5 + 0.5) * viewHeight;
				cluster.screenX = viewLeft + x;
				cluster.screenY = viewTop + y;
				edge
					.copy(cluster.center)
					.addScaledVector(cameraRight, cluster.radius + 1)
					.applyMatrix4(viewProjection);
				cluster.screenRadius = Math.hypot(
					(edge.x * 0.5 + 0.5) * viewWidth - x,
					(-edge.y * 0.5 + 0.5) * viewHeight - y
				);

				if (!label) continue;
				const emphasised = i === hoveredClusterIndex || i === focusedCluster;
				const presence = emphasised
					? 1
					: 0.3 + 0.5 * THREE.MathUtils.smoothstep(cluster.front, -0.6, 0.9);
				const opacity = cluster.onScreen ? Math.round(appear * presence * 100) / 100 : 0;
				if (opacity !== cluster.labelOpacity) {
					cluster.labelOpacity = opacity;
					label.style.opacity = String(opacity);
					label.style.visibility = opacity > 0 ? 'visible' : 'hidden';
				}
				if (opacity === 0) continue;

				labelPoint.copy(cluster.center);
				labelPoint.y += cluster.radius + 1.5;
				projected.copy(labelPoint).applyMatrix4(viewProjection);
				const transform = `translate(${snap((projected.x * 0.5 + 0.5) * viewWidth)}px, ${snap((-projected.y * 0.5 + 0.5) * viewHeight)}px)`;
				if (label.style.transform !== transform) label.style.transform = transform;
				const z = String(i === hoveredClusterIndex ? 200 : Math.round((cluster.front + 1) * 50));
				if (label.style.zIndex !== z) label.style.zIndex = z;
			}
		}

		/** Which cluster the cursor is over, front-most first. */
		function hitCluster(testing: boolean): number | null {
			if (!clustered() || clusterMix < 0.6 || selectedId) return null;
			if (labelHoverIndex !== null) return labelHoverIndex;
			if (hoveredId) return nodeById.get(hoveredId)?.cluster ?? null;
			if (!testing) return null;
			let best: number | null = null;
			for (let i = 0; i < clusters.length; i++) {
				const cluster = clusters[i];
				if (!cluster.onScreen) continue;
				const distance = Math.hypot(pointer!.x - cluster.screenX, pointer!.y - cluster.screenY);
				if (distance > Math.max(cluster.screenRadius, 14)) continue;
				if (best === null || cluster.front > clusters[best].front) best = i;
			}
			return best;
		}

		/**
		 * The single pass over the field: travel, the room the held node is
		 * given, how each node should look, and the hit test — all of it, once
		 * per node per frame.
		 *
		 * Keeping it to one walk is the point. A node's travel is a couple of
		 * multiplies and its easings usually have nothing left to do, so at
		 * ~300 nodes the loop itself, and reading the same objects back three
		 * times over, cost more than the arithmetic inside them.
		 *
		 * A held node keeps its angle rather than being wound back on release,
		 * so letting go picks the journey up from exactly where it stopped.
		 * Whichever nodes are about to pass close by lift or dip a few units —
		 * whichever way round they are already nearer — and are back on their
		 * own course the moment they are out of range again, rather than riding
		 * the detour until the cursor leaves.
		 *
		 * The hit test reads the positions this same pass has just written, so
		 * the node it finds lights up on the following frame. That is one frame
		 * nobody can see, and it saves walking and projecting the field twice.
		 */
		function updateNodes(dt: number, lerpT: number, now: number) {
			// While an article is open, both its node and whichever one the
			// cursor is on stand still, but nothing steers around either: the
			// field behind the panel is backdrop, and nodes lifting out of the
			// way of a passing hover would only pull the eye off the article.
			const avoided =
				!selectedId && hoveredId && clusterMix === 0 ? nodeById.get(hoveredId) : undefined;
			const focusId = selectedId ?? hoveredId;
			// Once gathered, only the front cluster's nodes answer the pointer;
			// the rest are reached by bringing their cluster forward first.
			const frontOnly = clustered() && clusterMix > 0.6;
			if (!selectedId) highlight.visible = false;

			// The front and back of the field along the camera's line of sight,
			// which is what "how near is this node" is measured against below.
			const nearDepth = camera.position.distanceTo(controls.target) - fieldRadius;
			const depthSpan = fieldRadius * 2;

			// The hit test is the expensive half of the pass, and there is
			// nothing to gain from it while the transcript owns the screen, the
			// cursor is off the canvas, or it is over something drawn on top.
			const testing = interactive && pointer !== null && !drag && !pointerIsBlocked(now);
			if (testing) camera.matrixWorld.extractBasis(cameraRight, scratch, scratch);

			let nearestId: string | null = null;
			let nearestDistanceSq = Infinity;
			let nearestHitAreaSq = 0;
			let scalesDirty = false;
			let opacitiesDirty = false;

			for (let i = 0; i < count; i++) {
				const node = nodes[i];

				const spinTarget = node.id === hoveredId || node.id === selectedId ? 0 : 1;
				if (node.spin !== spinTarget) {
					node.spin = ease(node.spin, spinTarget, FREEZE_RATE, dt);
					if (Math.abs(node.spin - spinTarget) < 0.001) node.spin = spinTarget;
				}
				if (node.spin !== 0) node.angle -= ORBIT_SPEED * node.spin * dt;

				let x = Math.cos(node.angle) * node.radius;
				let z = Math.sin(node.angle) * node.radius;

				let detour = 0;
				if (avoided !== undefined && node !== avoided) {
					// Squared distance first: all but a handful of nodes are
					// nowhere near the held one, and for them this comparison is
					// the whole of the avoidance.
					const dx = x - avoided.position.x;
					const dz = z - avoided.position.z;
					const reachSq = dx * dx + dz * dz;
					if (reachSq < AVOID_RANGE * AVOID_RANGE) {
						// Measured against the course the node would hold
						// anyway, so a detour never feeds back into itself.
						const gap = node.baseY - avoided.position.y;
						const room = AVOID_CLEARANCE - Math.abs(gap);
						if (room > 0) {
							const nearness = 1 - THREE.MathUtils.smoothstep(Math.sqrt(reachSq), 0, AVOID_RANGE);
							detour = Math.sign(gap || 1) * room * nearness;
						}
					}
				}
				if (node.yOffset !== detour) {
					node.yOffset = ease(node.yOffset, detour, COURSE_RATE, dt);
					if (Math.abs(node.yOffset - detour) < 0.001) node.yOffset = detour;
				}

				let y = node.baseY + node.yOffset;

				// Gathered: slide from the free field towards the node's place
				// in its cluster, each node setting off a little after the last.
				let gathered = 0;
				if (clusterMix > 0) {
					if (node.spin !== 0) node.localAngle += CLUSTER_SPIN * node.spin * dt;
					const t = THREE.MathUtils.clamp(
						(clusterMix - node.delay * CLUSTER_STAGGER) / (1 - CLUSTER_STAGGER),
						0,
						1
					);
					gathered = t * t * (3 - 2 * t);
					if (gathered > 0) {
						const center = clusters[node.cluster].center;
						const cx = center.x + Math.cos(node.localAngle) * node.localRadius;
						const cy = center.y + node.localY;
						const cz = center.z + Math.sin(node.localAngle) * node.localRadius;
						x += (cx - x) * gathered;
						y += (cy - y) * gathered;
						z += (cz - z) * gathered;
					}
				}

				node.position.set(x, y, z);
				offsetArray[i * 3] = x;
				offsetArray[i * 3 + 1] = y;
				offsetArray[i * 3 + 2] = z;

				// Two or three nodes at most are ever mid-transition, so the
				// arrays are left alone — and left un-uploaded — otherwise.
				let multiplier = 1;
				if (node.id === selectedId) {
					// Sized against the distance the camera settles at, not the
					// current one, so the square lands on SELECTED_NODE_PX rather
					// than shrinking as the camera closes in. The squircle fills
					// 0.9 of its quad.
					multiplier =
						(SELECTED_NODE_PX * 2 * FOCUS_DISTANCE) /
						(0.9 * camera.projectionMatrix.elements[5] * viewHeight * PARAMS.nodeSize);
				} else if (node.id === hoveredId) {
					const depth = (node.position.distanceTo(camera.position) - nearDepth) / depthSpan;
					// The depth band is the free field's; a cluster is small enough
					// that the whole of it can take the growth.
					const allowance = frontOnly
						? 1
						: THREE.MathUtils.smoothstep(depth, HOVER_SCALE_NEAR_ZONE, HOVER_SCALE_FULL_ZONE);
					multiplier = 1 + (HOVER_SCALE - 1) * allowance;
				}
				const scaleTarget = PARAMS.nodeSize * multiplier;
				if (scaleArray[i] !== scaleTarget) {
					const next = THREE.MathUtils.lerp(scaleArray[i], scaleTarget, lerpT);
					scaleArray[i] = Math.abs(next - scaleTarget) < 0.001 ? scaleTarget : next;
					scalesDirty = true;
				}

				if (node.id === selectedId) {
					const highlightOffsetArray = highlightOffset.array as Float32Array;
					highlightOffsetArray[0] = x;
					highlightOffsetArray[1] = y;
					highlightOffsetArray[2] = z;
					(highlightScale.array as Float32Array)[0] = scaleArray[i];
					highlightOffset.needsUpdate = true;
					highlightScale.needsUpdate = true;
					highlight.visible = true;
				}

				let opacityTarget =
					!focusId || node.id === focusId || litIds.has(node.id) ? 1 : DIM_OPACITY;
				if (gathered > 0 && !focusId) {
					// The front and hovered clusters read solid; the rest recede
					// with their distance round the ring.
					const ring =
						node.cluster === focusedCluster || node.cluster === hoveredClusterIndex
							? 1
							: THREE.MathUtils.lerp(
									BACK_CLUSTER_OPACITY,
									SIDE_CLUSTER_OPACITY,
									THREE.MathUtils.smoothstep(clusters[node.cluster].front, -0.6, 0.85)
								);
					opacityTarget = Math.round((1 + (ring - 1) * gathered) * 100) / 100;
				}
				if (opacityArray[i] !== opacityTarget) {
					const next = THREE.MathUtils.lerp(opacityArray[i], opacityTarget, lerpT);
					opacityArray[i] = Math.abs(next - opacityTarget) < 0.002 ? opacityTarget : next;
					opacitiesDirty = true;
				}

				if (!testing || (frontOnly && node.cluster !== focusedCluster)) continue;

				// Nodes are billboards a pixel or two across, so raycasting them
				// is a frustrating hit test. Projecting each and measuring pixel
				// distance against its own projected radius gives a hit area
				// that stays generous when a node is far away.
				projected.set(x, y, z).applyMatrix4(viewProjection);
				if (projected.z < -1 || projected.z > 1) continue;

				const screenX = viewLeft + (projected.x * 0.5 + 0.5) * viewWidth;
				const screenY = viewTop + (-projected.y * 0.5 + 0.5) * viewHeight;
				const offX = pointer!.x - screenX;
				const offY = pointer!.y - screenY;
				const distanceSq = offX * offX + offY * offY;
				if (distanceSq >= nearestDistanceSq) continue;

				// Only ever reached by a node that is the nearest so far, which
				// is a handful of nodes a frame rather than all of them.
				edge
					.set(x, y, z)
					.addScaledVector(cameraRight, HOVER_HIT_WORLD_RADIUS)
					.applyMatrix4(viewProjection);
				const edgeX = viewLeft + (edge.x * 0.5 + 0.5) * viewWidth;
				const edgeY = viewTop + (-edge.y * 0.5 + 0.5) * viewHeight;
				const hitArea = Math.max(6, Math.hypot(edgeX - screenX, edgeY - screenY));

				nearestId = node.id;
				nearestDistanceSq = distanceSq;
				nearestHitAreaSq = hitArea * hitArea;
			}

			offsets.needsUpdate = true;
			if (scalesDirty) scales.needsUpdate = true;
			if (opacitiesDirty) opacities.needsUpdate = true;

			hoveredId = testing && nearestDistanceSq <= nearestHitAreaSq ? nearestId : null;

			const cluster = hitCluster(testing);
			if (cluster !== hoveredClusterIndex) hoveredClusterIndex = cluster;

			if (clusterMix > 0 || renderer.domElement.style.cursor) {
				const cursor = !clustered()
					? ''
					: drag
						? 'grabbing'
						: hoveredId || (cluster !== null && cluster !== focusedCluster)
							? 'pointer'
							: 'grab';
				if (renderer.domElement.style.cursor !== cursor) renderer.domElement.style.cursor = cursor;
			}
		}

		let windowFrames = 0;
		let windowTotalMs = 0;
		let comfortableWindows = 0;

		/**
		 * Give a struggling machine back the one thing it costs nothing to
		 * lose: pixels. Frame times are averaged over a window rather than
		 * judged one at a time, and stepping back up takes several comfortable
		 * windows in a row, so a machine sitting near the threshold settles
		 * instead of visibly hunting between two resolutions.
		 */
		function adaptResolution(frameMs: number) {
			// A frame this long is a stall — a tab coming back, a GC pause, the
			// first frames after a route change — not the steady state.
			if (frameMs <= 0 || frameMs > 100) return;
			windowTotalMs += frameMs;
			if (++windowFrames < RESOLUTION_WINDOW_FRAMES) return;

			const average = windowTotalMs / windowFrames;
			windowFrames = 0;
			windowTotalMs = 0;

			if (average > SLOW_FRAME_MS) {
				comfortableWindows = 0;
				if (pixelRatio <= PIXEL_RATIO_FLOOR) return;
				pixelRatio = Math.max(PIXEL_RATIO_FLOOR, pixelRatio - PIXEL_RATIO_STEP);
				renderer.setPixelRatio(pixelRatio);
				return;
			}

			if (average > FAST_FRAME_MS) {
				comfortableWindows = 0;
				return;
			}

			const ceiling = Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP);
			if (pixelRatio >= ceiling) return;
			if (++comfortableWindows < RESOLUTION_RECOVERY_WINDOWS) return;
			comfortableWindows = 0;
			pixelRatio = Math.min(ceiling, pixelRatio + PIXEL_RATIO_STEP);
			renderer.setPixelRatio(pixelRatio);
		}

		let lastFrameTime = 0;
		const animate = (time: number) => {
			frameId = requestAnimationFrame(animate);
			// Frame-rate independent easing, matching the prototype's constant.
			const lerpT = 1 - Math.pow(0.0001, 1 / 60);
			// Clamped so a hidden tab, or a field coming back from `paused`,
			// resumes travelling rather than jumping the whole gap forward.
			const frameMs = lastFrameTime ? time - lastFrameTime : 0;
			const dt = lastFrameTime ? Math.min(frameMs / 1000, 0.05) : 1 / 60;
			lastFrameTime = time;

			updateClusters(dt);
			updateFocus(lerpT);
			updateClusterRig(dt);
			controls.update();

			// Everything below works from where the camera has just ended up,
			// rather than from where it was a frame ago.
			camera.updateMatrixWorld();
			camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
			viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

			updateClusterLabels();
			updateNodes(dt, lerpT, time);

			renderer.render(scene, camera);
			updateAnchor();
			updateLinks();
			adaptResolution(frameMs);
		};

		const handleResize = () => {
			if (!container) return;
			const rect = renderer.domElement.getBoundingClientRect();
			viewLeft = rect.left;
			viewTop = rect.top;
			viewWidth = container.clientWidth;
			viewHeight = container.clientHeight;
			camera.aspect = viewWidth / viewHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(viewWidth, viewHeight);
		};
		window.addEventListener('resize', handleResize);
		handleResize();

		let wasLocked = false;
		$effect(() => {
			// Selection locks the orbit controls; the rest of the field keeps
			// travelling, so it stays alive while you read. The clustered view
			// locks them too: there a drag turns the ring instead.
			const locked = selectedId !== null || clusterArea !== null;
			if (wasLocked && !locked) returning = true;
			wasLocked = locked;
			controls.enableRotate = !locked;
			controls.enablePan = !locked;
			controls.enableZoom = !locked;
		});

		$effect(() => {
			const id = clusterArea;
			untrack(() => {
				if (id === null) {
					clusterTarget = 0;
					drag = null;
					ringVelocity = null;
					return;
				}
				const index = clusterIndexByArea.get(id) ?? 0;
				if (clusterMix === 0) {
					// Starting fresh: the front is wherever the camera already
					// looks from, so the field gathers in place rather than
					// swinging round, and the ring starts with this area in front.
					frontAngle = Math.atan2(
						camera.position.z - controls.target.z,
						camera.position.x - controls.target.x
					);
					clusterDistance = CLUSTER_VIEW_DISTANCE;
					clusterElevation = CLUSTER_ELEVATION;
					turnTo(index);
					ringYaw = ringYawTarget;
				} else {
					turnTo(index);
				}
				clusterTarget = 1;
				returning = false;
			});
		});

		$effect(() => {
			cancelAnimationFrame(frameId);
			if (!paused) {
				// However long the menu was open is not a frame anyone sat
				// through, so the next one starts the clock again.
				lastFrameTime = 0;
				frameId = requestAnimationFrame(animate);
			}
		});

		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onDragEnd);
			window.removeEventListener('pointercancel', onDragEnd);
			window.removeEventListener('resize', handleResize);
			renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
			renderer.domElement.removeEventListener('pointerdown', onPointerDown);
			renderer.domElement.removeEventListener('pointerup', onPointerUp);
			renderer.domElement.removeEventListener('wheel', onWheel);
			geometry.dispose();
			highlightGeometry.dispose();
			material.dispose();
			highlightMaterial.dispose();
			texture.dispose();
			selectedTexture.dispose();
			controls.dispose();
			renderer.dispose();
		};
	});
</script>

<div bind:this={container} class="relative h-full w-full overflow-hidden">
	<!-- Cluster titles, parked above each cluster by the frame loop. -->
	{#each clusterLayout as cluster, i (cluster.area.id)}
		<button
			bind:this={clusterLabelEls[i]}
			type="button"
			class="cluster-label"
			class:is-front={focusedClusterIndex === i}
			class:is-hovered={hoveredClusterIndex === i}
			style="visibility: hidden; opacity: 0;"
			style:pointer-events={clusterLabelsLive ? 'auto' : 'none'}
			tabindex={clusterLabelsLive ? 0 : -1}
			aria-hidden={!clusterLabelsLive}
			aria-label={`${cluster.area.name}, ${cluster.count} articles`}
			onpointerenter={() => (labelHoverIndex = i)}
			onpointerleave={() => {
				if (labelHoverIndex === i) labelHoverIndex = null;
			}}
			onfocus={() => (labelHoverIndex = i)}
			onblur={() => {
				if (labelHoverIndex === i) labelHoverIndex = null;
			}}
			onclick={() => focusClusterFromLabel(i)}
		>
			<span use:squircle={{ radius: 8 }} class="cluster-label-card">
				<span>{cluster.area.name}</span>
				<span class="cluster-label-count">{cluster.count}</span>
			</span>
		</button>
	{/each}

	<div
		class="pointer-events-none absolute inset-0 transition-opacity duration-200"
		style:opacity={linksVisible ? 1 : 0}
		aria-hidden="true"
	>
		<svg class="absolute inset-0 h-full w-full">
			{#each LINK_SLOTS as i (i)}
				<path bind:this={stringEls[i]} class="string" pathLength="1" visibility="hidden" />
			{/each}
		</svg>

		{#each LINK_SLOTS as i (i)}
			<div bind:this={labelEls[i]} class="absolute top-0 left-0" style="visibility: hidden;">
				<div bind:this={labelCardEls[i]} use:squircle={{ radius: 8 }} class="related-title">
					<span class="line-clamp-3">{links[i]?.title ?? ''}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.string {
		fill: none;
		stroke: var(--color-off-black);
		stroke-width: 1px;
		stroke-linecap: round;
		/* A dash the length of the whole path, for it to draw out along. */
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
	}

	/*
	 * Cluster titles. Quiet by default, so sixteen of them don't shout over the
	 * nodes; the front one firms up, and the hovered one turns into the solid
	 * pill the rest of the field uses for whatever is active.
	 */
	.cluster-label {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		transition: opacity 200ms linear;
	}

	.cluster-label:focus-visible {
		outline: none;
	}

	.cluster-label-card {
		display: inline-flex;
		align-items: baseline;
		gap: 0;
		padding: 6px 8px;
		border-radius: 8px;
		white-space: nowrap;
		font-family: 'IBM Mono', courier, monospace;
		font-size: 12px;
		line-height: 100%;
		color: var(--color-off-black);
		background: rgb(150 150 150 / 0.22);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		transform: translate(-50%, -100%);
		transform-origin: 50% 100%;
		transition:
			transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
			background-color 250ms ease,
			color 250ms ease;
	}

	.cluster-label-count {
		max-width: 0;
		overflow: hidden;
		opacity: 0;
		color: var(--color-medium-grey);
		transition:
			max-width 450ms cubic-bezier(0.16, 1, 0.3, 1),
			margin 450ms cubic-bezier(0.16, 1, 0.3, 1),
			opacity 250ms ease;
	}

	.is-front .cluster-label-card {
		background: rgb(150 150 150 / 0.5);
		transform: translate(-50%, -100%) scale(1.17);
	}

	.is-hovered .cluster-label-card,
	.cluster-label:focus-visible .cluster-label-card {
		color: #fff;
		background: var(--color-off-black);
		transform: translate(-50%, -100%) scale(1.33);
	}

	.is-front .cluster-label-count,
	.is-hovered .cluster-label-count,
	.cluster-label:focus-visible .cluster-label-count {
		max-width: 4ch;
		margin-left: 1ch;
		opacity: 1;
	}

	/* The type of the "node // 0000" pill, wrapped since a title is far longer. */
	.related-title {
		width: max-content;
		max-width: 280px;
		padding: 8px;
		border-radius: 8px;
		font-family: 'IBM Mono', courier, monospace;
		font-size: 14px;
		line-height: 120%;
		color: var(--color-off-black);
		background: rgb(150 150 150 / 0.5);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
</style>
