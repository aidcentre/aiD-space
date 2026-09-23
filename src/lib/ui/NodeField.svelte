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
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import type { Article } from '$lib/data/articles';

	let {
		articles,
		paused = false,
		interactive = true,
		selectedId = null,
		hoveredId = $bindable(null),
		anchor = null,
		onselect
	}: {
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

	let container = $state<HTMLDivElement>();

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
		};

		const nodes: Node[] = articles.map((article) => {
			const random = mulberry32(seedFrom(article.id));
			const x = (random() - 0.5) * PARAMS.width;
			const y = (random() - 0.5) * PARAMS.height;
			const z = (random() - 0.5) * PARAMS.depth;
			return {
				id: article.id,
				position: new THREE.Vector3(x, y, z),
				radius: Math.hypot(x, z),
				angle: Math.atan2(z, x),
				baseY: y,
				spin: 1,
				yOffset: 0
			};
		});

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
		};
		const onPointerLeave = () => {
			pointer = null;
		};
		const onPointerDown = (event: PointerEvent) => {
			pressedAt = { x: event.clientX, y: event.clientY };
			returning = false;
		};
		const onPointerUp = (event: PointerEvent) => {
			if (!pressedAt) return;
			const travelled = Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y);
			pressedAt = null;
			// Releasing after an orbit drag should not open whatever happens to
			// be under the cursor.
			if (travelled > CLICK_SLOP_PX) return;
			onselect?.(hoveredId);
		};

		window.addEventListener('pointermove', onPointerMove);
		renderer.domElement.addEventListener('pointerleave', onPointerLeave);
		renderer.domElement.addEventListener('pointerdown', onPointerDown);
		renderer.domElement.addEventListener('pointerup', onPointerUp);

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
			anchor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

			// The squircle fills 0.9 of its quad, so its visible top sits 0.45
			// of the quad's scaled size above the centre. Published so the
			// tooltip can line its top up with the square's.
			const scale = scaleArray[nodes.indexOf(node)];
			const depth = -viewPosition.copy(node.position).applyMatrix4(camera.matrixWorldInverse).z;
			const halfHeight =
				depth > 0
					? (0.45 * scale * camera.projectionMatrix.elements[5] * viewHeight) / (2 * depth)
					: 0;
			anchor.style.setProperty('--node-half-height', `${halfHeight.toFixed(1)}px`);
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
			const avoided = !selectedId && hoveredId ? nodeById.get(hoveredId) : undefined;
			const focusId = selectedId ?? hoveredId;
			if (!selectedId) highlight.visible = false;

			// The front and back of the field along the camera's line of sight,
			// which is what "how near is this node" is measured against below.
			const nearDepth = camera.position.distanceTo(controls.target) - fieldRadius;
			const depthSpan = fieldRadius * 2;

			// The hit test is the expensive half of the pass, and there is
			// nothing to gain from it while the transcript owns the screen, the
			// cursor is off the canvas, or it is over something drawn on top.
			const testing = interactive && pointer !== null && !pointerIsBlocked(now);
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

				const x = Math.cos(node.angle) * node.radius;
				const z = Math.sin(node.angle) * node.radius;

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

				const y = node.baseY + node.yOffset;
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
					const allowance = THREE.MathUtils.smoothstep(
						depth,
						HOVER_SCALE_NEAR_ZONE,
						HOVER_SCALE_FULL_ZONE
					);
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

				const opacityTarget = !focusId || node.id === focusId ? 1 : DIM_OPACITY;
				if (opacityArray[i] !== opacityTarget) {
					const next = THREE.MathUtils.lerp(opacityArray[i], opacityTarget, lerpT);
					opacityArray[i] = Math.abs(next - opacityTarget) < 0.002 ? opacityTarget : next;
					opacitiesDirty = true;
				}

				if (!testing) continue;

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

			updateFocus(lerpT);
			controls.update();

			// Everything below works from where the camera has just ended up,
			// rather than from where it was a frame ago.
			camera.updateMatrixWorld();
			camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
			viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

			updateNodes(dt, lerpT, time);

			renderer.render(scene, camera);
			updateAnchor();
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

		let wasSelected = false;
		$effect(() => {
			// Selection locks the orbit controls; the rest of the field keeps
			// travelling, so it stays alive while you read.
			const locked = selectedId !== null;
			if (wasSelected && !locked) returning = true;
			wasSelected = locked;
			controls.enableRotate = !locked;
			controls.enablePan = !locked;
			controls.enableZoom = !locked;
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
			window.removeEventListener('resize', handleResize);
			renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
			renderer.domElement.removeEventListener('pointerdown', onPointerDown);
			renderer.domElement.removeEventListener('pointerup', onPointerUp);
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

<div bind:this={container} class="h-full w-full"></div>
