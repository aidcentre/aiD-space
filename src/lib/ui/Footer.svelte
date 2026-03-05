<script lang="ts">
	import LinkWithArrow from '$lib/contact/LinkWithArrow.svelte';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let frameId: number;

	const params = {
		nodeCount: 15,
		nodeSize: 3,
		// below are the three parameters to control the size of the cloud
		areaWidth: 27,
		areaHeight: 27,
		areaDepth: 27,
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
	class="flex flex-col bg-(--off-black) p-[1rem] text-(--light-grey) max-md:gap-4 md:footer md:grid md:grid-cols-4"
>
	<aside
		class="flex w-9/10 flex-col gap-[1.5rem] font-[Montagu_Slab] text-[1.125rem] leading-[1.375rem] font-light"
	>
		<p class="">
			aiD is headquartered at the Norwegian University of Science and Technology in Trondheim,
			Norway and at SINTEF, Norway.
		</p>
		<div class="flex flex-col">
			<p>info@aid-research.com</p>
			<p>+47 22 22 55 55</p>
		</div>
	</aside>
	<div class="py-4 sm:hidden">
		<LinkWithArrow label="aiD at The Research Council of Norway" white={true} />
	</div>
	<div class="z-2 col-span-2 h-[40vh] w-full md:h-[60vh]" bind:this={container}></div>
	<nav class="justify-self-end md:justify-self-end">
		<a href="#top" class="inline-flex items-center text-xs" style:gap="0.5rem">
			<div class="up-arrow">←</div>
			<span>Back to top</span>
		</a>
	</nav>
	<div class="relative bottom-0 left-0 max-sm:hidden">
		<LinkWithArrow label="aiD at The Research Council of Norway" white={true} />
	</div>
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
