<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';
	import { onMount } from 'svelte';
	import Page from '../../routes/+page.svelte';
	const { text = '', class: className = '' } = $props();

	// scrolltrigger plugin makes animation run when user scrolls to it
	gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger, SplitText);

	let element: HTMLElement;

	onMount(() => {
		// check if span is already in viewport. if not, wait until user scrolls to animate
		const rect = element.getBoundingClientRect();
		const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

		// use splitText to get individual characters and words and filter out spaces
		let st = SplitText.create(element, { type: 'chars, words' });
		const chars = st.chars.filter((char) => char.textContent.trim() !== '');

		// make max width of each character its original width so scramble chars don't change the layout
		chars.forEach((char) => {
			const el = char as HTMLElement;
			el.style.display = 'inline-block';
			el.style.maxWidth = el.offsetWidth + 'px';
		});

		// make scramble faster for longer texts
		let scrambleSpeed: number;
		chars.length < 100 ? (scrambleSpeed = 0.03) : (scrambleSpeed = 0.005);

		if (isInViewport) {
			// for each character, animate it with scrambletext and a delay based on the index so that the scramble is staggered
			chars.forEach((char, i) => {
				gsap.to(char, {
					opacity: 1,
					duration: 0.8,
					delay: i * scrambleSpeed,
					scrambleText: {
						text: char.textContent,
						chars: '!@#$%^&*()_+:"1234567890',
						speed: 1
					}
				});
			});
		} else {
			// if element is outside of viewport, don't animate unless it's scrolled to
			chars.forEach((char, i) => {
				gsap.to(char, {
					opacity: 1,
					duration: 0.8,
					delay: i * scrambleSpeed,
					scrambleText: {
						text: char.textContent,
						chars: '0123456789',
						speed: 1
					},
					scrollTrigger: {
						trigger: element,
						start: 'bottom 75%',
						toggleActions: 'restart none none none'
					}
				});
			});
		}
	});
</script>

<p bind:this={element} class="{className} min-h-full w-full">
	{text}
</p>
