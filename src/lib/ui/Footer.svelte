<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let frameId: number;

	const params = {
		nodeCount: 15,
		nodeSize: 3,
		// below are the three parameters to control the size of the cloud
		areaWidth: 30,
		areaHeight: 30,
		areaDepth: 30,
		rotationSpeed: 0.003
	};

	onMount(() => {
		const scene = new THREE.Scene();
		// transparent background
		scene.background = null;

		const camera = new THREE.PerspectiveCamera(
			50,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 50;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		// create particles
		const cloudGroup = new THREE.Group();
		scene.add(cloudGroup);

		const squircleTexture = createSquircleTexture();
		const nodeMaterial = new THREE.SpriteMaterial({
			map: squircleTexture,
			color: 0xe8e8e8,
			transparent: true
		});

		for (let i = 0; i < params.nodeCount; i++) {
			const sprite = new THREE.Sprite(nodeMaterial);

			sprite.position.set(
				(Math.random() - 0.5) * params.areaWidth,
				(Math.random() - 0.5) * params.areaHeight,
				(Math.random() - 0.5) * params.areaDepth
			);

			sprite.scale.set(params.nodeSize, params.nodeSize, 1);
			cloudGroup.add(sprite);
		}

		function createSquircleTexture() {
			const size = 64;
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d')!;
			const r = size * 0.45;
			const n = 4.5;
			const center = size / 2;
			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			for (let i = 0; i <= 64; i++) {
				const t = (Math.PI * 2 * i) / 64;
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

		const animate = () => {
			frameId = requestAnimationFrame(animate);

			// rotate around the vertical axis from top to bottom edge of screen
			cloudGroup.rotation.y += params.rotationSpeed;

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

<footer
	class="footer grid w-full grid-cols-4 bg-(--off-black) p-2 text-(--light-grey) sm:footer-horizontal"
>
	<aside class="font-[Montagu_Slab] font-light">
		<p>
			aiD is headquartered at the Norwegian University of Science and Technology in Trondheim,
			Norway and at SINTEF, Norway.
		</p>
		<p>info@aid-research.com</p>
		<p>+47 22 22 55 55</p>
	</aside>
	<div class=" z-2 col-span-2 h-[60vh] w-full" bind:this={container}></div>
	<nav>
		<a href="/about" class="inline-flex items-center" style:gap="0.5rem">
			<div class="up-arrow">←</div>
			<span>Back to top</span>
		</a>
	</nav>
</footer>

<style>
	.up-arrow {
		rotate: 90deg;
		display: flex;
		padding: 0.25rem;
		line-height: 0.75rem;
		justify-content: center;
		align-items: center;
		border-radius: 0.25rem;
		border: 2px solid var(--light-grey, #e8e8e8);
		height: fit-content;
		aspect-ratio: 1/1;
	}
</style>
