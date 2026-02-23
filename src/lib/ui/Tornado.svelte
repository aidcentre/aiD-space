<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let frameId: number;

	// adjustable parameters
	const params = {
		width: 70,
		height: 50,
		depth: 70,
		nodeCount: 200,
		nodeSize: 0.75,
		moveSpeed: 0.0,
		orbitSpeed: 0.5
	};

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
		camera.position.set(60, 60, 60);

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = params.orbitSpeed;
		controls.enableZoom = true;
		controls.enablePan = true;

		const nodes: THREE.Sprite[] = [];

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

<div class="fixed inset-0 flex-col items-center justify-center" bind:this={container}></div>
