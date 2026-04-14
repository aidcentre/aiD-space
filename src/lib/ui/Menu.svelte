<script lang="ts">
	import { fly } from 'svelte/transition';
	import NodeSphere from './NodeSphere.svelte';
	import { menuOpen } from '$lib/stores/menu';
	import NavButton from './NavButton.svelte';
	import Link from './Link.svelte';

	const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t));

	const links = [
		{ label: 'About & contact', link: 'contact' },
		{ label: 'What is aiD?', link: 'about' }
	];
</script>

{#if $menuOpen}
	<div transition:fly={{ y: 0, duration: 800, easing: easeOutExpo }} class="fixed inset-0 z-30 bg-off-black flex flex-col p-4 text-white pointer-events-none">
		<div class="pointer-events-auto flex h-full w-full flex-col justify-between z-30">
			<div class="flex flex-col md:flex-row items-end md:items-start justify-end gap-1 pt-16 md:pt-20">
				{#each links as { label, link } (link)}
					<NavButton {label} {link} />
				{/each}
			</div>
			<div class="flex w-full flex-col gap-8 text-white md:w-120">
				<div class="text-sm md:text-base font-family-serif">aiD is headquartered at the Norwegian University of Science and Technology in Trondheim, Norway and at SINTEF, Norway.</div>
				<div class="flex flex-col gap-1">
					<Link 
						href="mailto:iben.nesset@sintef.no" 
						theme="dark"
					>
						iben.nesset@sintef.no
					</Link>
					<Link 
						href="tel:+47 91 71 31 84" 
						theme="dark"
					>
						+47 91 71 31 84
					</Link>
					<Link 
						href="https://aid-center.no/" 
						theme="dark"
						border={true}
						trailing={true}
					>
						aiD at the Research Council of Norway
					</Link>
				</div>
			</div>
		</div>
		<div class="fixed inset-0 -mt-24 pointer-events-none z-20 {$menuOpen ? 'opacity-50' : 'opacity-0'}">
			<NodeSphere theme="dark" />
		</div>
	</div>
{/if}