<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';
	const { text, class: className } = $props();

	// scrolltrigger plugin makes animation run when user scrolls to it
	gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

	let element: HTMLElement;

	onMount(() => {
		gsap.to(element, {
			duration: 1.5,
			scrambleText: {
				text: text,
				chars: '0123456789',
				speed: 0.5
			},

			scrollTrigger: {
				trigger: element,
				start: 'bottom 75%',
				toggleActions: 'restart none none none'
			}
		});
	});
</script>

<span bind:this={element} class={className}>
	{text}
</span>
