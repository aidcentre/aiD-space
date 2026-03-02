<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';
	const { text, class: className = '' } = $props();

	// scrolltrigger plugin makes animation run when user scrolls to it
	gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

	let element: HTMLElement;

	onMount(() => {
		// check if span is already in viewport. if not, wait until user scrolls to animate
		const rect = element.getBoundingClientRect();
		const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

		if (isInViewport) {
			gsap.to(element, {
				duration: 1.5,
				scrambleText: {
					text: text,
					chars: '0123456789',
					speed: 0.5
				}
			});
		} else {
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
		}
	});
</script>

<span bind:this={element} class="{className} min-h-full w-full">
	{text}
</span>
