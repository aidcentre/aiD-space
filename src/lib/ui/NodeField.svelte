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
	 * means something and there are ~280 of them rather than 30:
	 *
	 *   - Positions come from a seeded PRNG keyed on the article id, so a given
	 *     article keeps its place in the field across reloads.
	 *   - Every sprite gets its own material. NodeSphere shares one across all
	 *     sprites, which makes per-node opacity impossible.
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
		selectedId = null,
		hoveredId = $bindable(null),
		anchor = null,
		blockers = () => [],
		onselect
	}: {
		articles: Article[];
		paused?: boolean;
		selectedId?: string | null;
		hoveredId?: string | null;
		/** Element parked on the active node each frame; holds the tooltip. */
		anchor?: HTMLElement | null;
		/** Panels that swallow the pointer, so hover does not fire behind them. */
		blockers?: () => (HTMLElement | null | undefined)[];
		onselect?: (id: string | null) => void;
	} = $props();

	const PARAMS = {
		// Larger than the prototype's 40³ because there are nearly ten times as
		// many nodes; this keeps the field about as sparse as the design.
		width: 72,
		height: 72,
		depth: 72,
		nodeSize: 1,
		orbitSpeed: 0.4
	};

	const BACKGROUND = 0xe8e8e8;
	const NODE_COLOR = '#050505';
	const DIM_OPACITY = 0.25;
	const HOVER_SCALE = 1.3;
	const ACTIVE_SCALE = 30 / 18;
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

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container!.clientWidth, container!.clientHeight);
		container!.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = PARAMS.orbitSpeed;
		controls.enableZoom = true;
		controls.enablePan = true;
		controls.mouseButtons.RIGHT = null;
		renderer.domElement.removeEventListener(
			'contextmenu',
			(controls as unknown as { _onContextMenu: (e: Event) => void })._onContextMenu
		);

		const texture = createSquircleTexture();

		type Node = { id: string; sprite: THREE.Sprite; position: THREE.Vector3 };

		const nodes: Node[] = articles.map((article) => {
			const random = mulberry32(seedFrom(article.id));
			const position = new THREE.Vector3(
				(random() - 0.5) * PARAMS.width,
				(random() - 0.5) * PARAMS.height,
				(random() - 0.5) * PARAMS.depth
			);
			const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
			const sprite = new THREE.Sprite(material);
			sprite.position.copy(position);
			sprite.scale.set(PARAMS.nodeSize, PARAMS.nodeSize, 1);
			scene.add(sprite);
			return { id: article.id, sprite, position };
		});

		const nodeById = new Map(nodes.map((node) => [node.id, node]));

		// --- pointer ------------------------------------------------------

		let pointer: { x: number; y: number } | null = null;
		let pressedAt: { x: number; y: number } | null = null;

		const onPointerMove = (event: PointerEvent) => {
			pointer = { x: event.clientX, y: event.clientY };
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

		function pointerIsBlocked(): boolean {
			if (!pointer) return true;
			return blockers().some((element) => {
				if (!element) return false;
				const rect = element.getBoundingClientRect();
				return (
					rect.width > 0 &&
					pointer!.x >= rect.left &&
					pointer!.x <= rect.right &&
					pointer!.y >= rect.top &&
					pointer!.y <= rect.bottom
				);
			});
		}

		// --- per-frame state ----------------------------------------------

		const cameraRight = new THREE.Vector3();
		const projected = new THREE.Vector3();
		const edge = new THREE.Vector3();
		const desiredTarget = new THREE.Vector3();
		const scratch = new THREE.Vector3();

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

		/**
		 * Nearest node to the cursor, in screen space.
		 *
		 * Sprites are billboards a pixel or two across, so raycasting them is
		 * a frustrating hit test. Projecting each node and measuring pixel
		 * distance against its own projected radius gives a hit area that
		 * stays generous when a node is far away.
		 */
		function updateHover(rect: DOMRect) {
			if (pointerIsBlocked()) {
				hoveredId = null;
				return;
			}

			camera.matrixWorld.extractBasis(cameraRight, scratch, scratch);

			let nearestId: string | null = null;
			let nearestDistance = Infinity;
			let nearestHitArea = 0;

			for (const node of nodes) {
				projected.copy(node.position).project(camera);
				if (projected.z < -1 || projected.z > 1) continue;

				const x = rect.left + (projected.x * 0.5 + 0.5) * rect.width;
				const y = rect.top + (-projected.y * 0.5 + 0.5) * rect.height;

				const distance = Math.hypot(pointer!.x - x, pointer!.y - y);
				if (distance >= nearestDistance) continue;

				edge
					.copy(node.position)
					.add(scratch.copy(cameraRight).multiplyScalar(HOVER_HIT_WORLD_RADIUS))
					.project(camera);
				const edgeX = rect.left + (edge.x * 0.5 + 0.5) * rect.width;
				const edgeY = rect.top + (-edge.y * 0.5 + 0.5) * rect.height;

				nearestId = node.id;
				nearestDistance = distance;
				nearestHitArea = Math.max(6, Math.hypot(edgeX - x, edgeY - y));
			}

			hoveredId = nearestId && nearestDistance <= nearestHitArea ? nearestId : null;
		}

		/** Park the tooltip anchor on whichever node is active. */
		function updateAnchor(rect: DOMRect) {
			if (!anchor) return;
			const active = selectedId ?? hoveredId;
			const node = active ? nodeById.get(active) : undefined;

			if (!node) {
				anchor.style.visibility = 'hidden';
				return;
			}

			projected.copy(node.position).project(camera);
			const x = (projected.x * 0.5 + 0.5) * rect.width;
			const y = (-projected.y * 0.5 + 0.5) * rect.height;
			anchor.style.visibility = projected.z > 1 ? 'hidden' : 'visible';
			anchor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
		}

		/**
		 * Pull the camera in on the selected node and slide it clear of the
		 * detail panel using an asymmetric view frustum, which moves the image
		 * without moving the camera or breaking the projection maths above.
		 */
		function updateFocus(rect: DOMRect, lerpT: number) {
			const node = selectedId ? nodeById.get(selectedId) : undefined;
			const mobile = rect.width < MOBILE_BREAKPOINT_PX;

			const targetOffsetX = node && !mobile ? PANEL_OCCUPIED_WIDTH_PX / 2 : 0;
			const targetOffsetY = node && mobile ? rect.height / 2 - MOBILE_NODE_TARGET_Y_PX : 0;

			viewOffsetX = THREE.MathUtils.lerp(viewOffsetX, targetOffsetX, lerpT);
			viewOffsetY = THREE.MathUtils.lerp(viewOffsetY, targetOffsetY, lerpT);

			if (Math.abs(viewOffsetX) < 0.5 && Math.abs(viewOffsetY) < 0.5) {
				if (camera.view?.enabled) camera.clearViewOffset();
			} else {
				camera.setViewOffset(
					rect.width,
					rect.height,
					viewOffsetX,
					viewOffsetY,
					rect.width,
					rect.height
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

		const animate = () => {
			frameId = requestAnimationFrame(animate);
			const rect = renderer.domElement.getBoundingClientRect();
			// Frame-rate independent easing, matching the prototype's constant.
			const lerpT = 1 - Math.pow(0.0001, 1 / 60);

			updateHover(rect);
			updateFocus(rect, lerpT);

			const focusId = selectedId ?? hoveredId;
			for (const node of nodes) {
				const isSelected = node.id === selectedId;
				const isHovered = node.id === hoveredId;
				const scale =
					PARAMS.nodeSize * (isSelected ? ACTIVE_SCALE : isHovered ? HOVER_SCALE : 1);
				const opacity = !focusId || node.id === focusId ? 1 : DIM_OPACITY;

				node.sprite.scale.x = THREE.MathUtils.lerp(node.sprite.scale.x, scale, lerpT);
				node.sprite.scale.y = node.sprite.scale.x;

				const material = node.sprite.material as THREE.SpriteMaterial;
				material.opacity = THREE.MathUtils.lerp(material.opacity, opacity, lerpT);
			}

			controls.update();
			renderer.render(scene, camera);
			updateAnchor(rect);
		};

		const handleResize = () => {
			if (!container) return;
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};
		window.addEventListener('resize', handleResize);

		let wasSelected = false;
		$effect(() => {
			// Selection locks the orbit controls but keeps the slow auto-rotate,
			// so the field stays alive while you read.
			const locked = selectedId !== null;
			if (wasSelected && !locked) returning = true;
			wasSelected = locked;
			controls.enableRotate = !locked;
			controls.enablePan = !locked;
			controls.enableZoom = !locked;
		});

		$effect(() => {
			cancelAnimationFrame(frameId);
			if (!paused) frameId = requestAnimationFrame(animate);
		});

		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('resize', handleResize);
			renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
			renderer.domElement.removeEventListener('pointerdown', onPointerDown);
			renderer.domElement.removeEventListener('pointerup', onPointerUp);
			for (const node of nodes) (node.sprite.material as THREE.SpriteMaterial).dispose();
			texture.dispose();
			controls.dispose();
			renderer.dispose();
		};
	});
</script>

<div bind:this={container} class="h-full w-full"></div>
