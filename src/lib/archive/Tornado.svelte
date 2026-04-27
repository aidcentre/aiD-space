<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import Button from '../ui/Button.svelte';

	// height not used currently
	// TODO: make function that rates heights and creates ratio to get each's height out of
	// 100%, (NOTE: height's minimum must be the height of the button itself)
	// TODO2: add smooth transition when navigating between sections (animation)
	const buttons = [
		{
			label: 'Our Research Areas',
			pos: 49,
			height: 35,
			align: 'left',
			sectionRef: 'research-areas'
		},
		{ label: 'What is aiD?', pos: 32, height: 20, align: 'left', sectionRef: 'what-is-aid' },
		{
			label: 'Sustainability and Ethics',
			pos: 28,
			height: 20,
			align: 'right',
			sectionRef: 'sustainability-and-ethics'
		},
		{
			label: 'Core Mission and Goals',
			pos: 36,
			height: 12,
			align: 'right',
			sectionRef: 'mission-and-goals'
		},
		{
			label: 'Real-World Impact and Use Cases',
			pos: 40,
			height: 35,
			align: 'left',
			sectionRef: 'impact-and-use-cases'
		}
	];

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let frameId: number;

	const params = {
		nodeCount: 200,
		nodeSize: 1,
		// below are the three parameters to control the size of the cloud
		areaWidth: 60,
		areaHeight: 40,
		areaDepth: 60,
		rotationSpeed: 0.006
	};

	onMount(() => {
		const scene = new THREE.Scene();
		// transparent background
		scene.background = null;

		const camera = new THREE.PerspectiveCamera(
			300,
			container.clientWidth / container.clientHeight,
			1,
			1000
		);
		camera.position.z = 70;

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
			color: 0x050505,
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

<!-- TODO: fix vertical button positioning without extra div after each -->
<div class="outer-wrapper">
	<div class="wrapper">
		<div class="canvas-container" bind:this={container}></div>

		<div class="button-layer">
			{#each buttons as button}
				<div class="button-w">
					<Button
						label={button.label}
						alignment={button.align}
						marginValue={button.pos}
						section_ref={button.sectionRef ?? ''}
					/>
				</div>
			{/each}
			<div class="button-w"></div>
		</div>
	</div>
	<div class="aid-description">
		<span style:font-size="0.9rem">What is aiD?</span>
		<p class="mt-2 text-xl font-extrabold">
			The Norwegian Centre on AI for Decisions (aiD) is a premier research hub dedicated to
			advancing the role of artificial intelligence in complex decision-making processes. As a
			cornerstone of the Research Council of Norway's (RCN) AI portfolio, aiD bridges technological,
			organizational, and human-centric gaps to foster a society where AI-driven value creation is
			safe and ethical.
		</p>
	</div>
</div>

<style>
	.outer-wrapper {
		position: relative;
		width: 100%;
		height: 100vh;
		margin-bottom: -3rem;
	}
	.aid-description {
		width: 58%;
		margin-left: 2rem;
	}
	.wrapper {
		position: relative;
		width: 100%;
		height: 60vh;
		overflow: hidden;
	}

	.canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.button-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-top: 4rem;
		z-index: 2;
	}
	.button-w {
		display: block;
		width: 100%;
		height: 20%;
	}
</style>
