<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let frameId: number;

	// adjustable Parameters
	const params = {
		width: 40,
		height: 40,
		depth: 40,
		nodeCount: 100,
		nodeSize: 1,
		moveSpeed: 0.0,
		orbitSpeed: 0.5
	};

	const BUTTON_TEXTS = [
		'What is aiD',
		'Our Research Areas',
		'Core Mission and Goals',
		'Our Partners',
		'Sustainability and Ethics'
	];

	onMount(() => {
		// initialize scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xe8e8e8);

		const camera = new THREE.PerspectiveCamera(
			60,
			container.clientWidth / container.clientHeight,
			1,
			3000
		);
		camera.position.set(60, 40, 60);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = params.orbitSpeed;

		const nodes: THREE.Sprite[] = [];

		// helper function: create text texture
		function createButtonTexture(text: string) {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;
			const fontSize = 44;
			ctx.font = `bold ${fontSize}px Milling`;
			const textMetrics = ctx.measureText(text);

			const h = 128;
			const horizontalPadding = 80;
			const w = textMetrics.width + horizontalPadding;

			canvas.width = w;
			canvas.height = h;

			ctx.font = `bold ${fontSize}px Milling`;
			ctx.fillStyle = '#000';
			ctx.beginPath();
			// use standard roundRect or fallback
			ctx.roundRect(0, 0, w, h, 24);
			ctx.fill();

			ctx.fillStyle = '#FFF';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(text, w / 2, h / 2);

			return {
				texture: new THREE.CanvasTexture(canvas),
				aspect: w / h
			};
		}

		// helper function: create squircle
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
			ctx.fillStyle = '#000';
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

		function randomizeNode(sprite: THREE.Sprite) {
			sprite.position.set(
				(Math.random() - 0.5) * params.width,
				(Math.random() - 0.5) * params.height,
				(Math.random() - 0.5) * params.depth
			);
			sprite.userData.velocity = new THREE.Vector3(
				(Math.random() - 0.5) * params.moveSpeed,
				(Math.random() - 0.5) * params.moveSpeed,
				(Math.random() - 0.5) * params.moveSpeed
			);
		}

		// component construction
		const squircleTexture = createSquircleTexture();
		const nodeMaterial = new THREE.SpriteMaterial({ map: squircleTexture, transparent: true });

		for (let i = 0; i < params.nodeCount; i++) {
			const sprite = new THREE.Sprite(nodeMaterial);
			randomizeNode(sprite);
			sprite.scale.set(params.nodeSize, params.nodeSize, 1);
			scene.add(sprite);
			nodes.push(sprite);
		}

		BUTTON_TEXTS.forEach((text) => {
			const { texture, aspect } = createButtonTexture(text);
			const buttonMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
			const buttonSprite = new THREE.Sprite(buttonMaterial);
			randomizeNode(buttonSprite);
			const baseHeight = 3.5;
			buttonSprite.scale.set(baseHeight * aspect, baseHeight, 1);
			scene.add(buttonSprite);
			nodes.push(buttonSprite);
		});

		// animation loop
		const animate = () => {
			frameId = requestAnimationFrame(animate);

			const bounds = { x: params.width / 2, y: params.height / 2, z: params.depth / 2 };
			nodes.forEach((node) => {
				node.position.add(node.userData.velocity);
				if (Math.abs(node.position.x) > bounds.x) node.userData.velocity.x *= -1;
				if (Math.abs(node.position.y) > bounds.y) node.userData.velocity.y *= -1;
				if (Math.abs(node.position.z) > bounds.z) node.userData.velocity.z *= -1;
			});

			controls.update();
			renderer.render(scene, camera);
		};

		const handleResize = () => {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		window.addEventListener('resize', handleResize);
		animate();

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(frameId);
			renderer.dispose();
		};
	});
</script>

<div class="canvas-container" bind:this={container}></div>

<style>
	.canvas-container {
		width: 100%;
		height: 50vh;
		position: relative;
		overflow: hidden;
	}
</style>
