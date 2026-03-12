<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';
	import { onMount } from 'svelte';
	const { text = '', class: className = '' } = $props();

	// scrolltrigger plugin makes animation run when user scrolls to it
	gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger, SplitText);

	let element: HTMLElement;

	onMount(() => {
		console.log('the element as-is -->', element);
		let st = SplitText.create(element, { type: 'chars, words' });

		// prevent wrapping mid-word
		// st.words.forEach((word) => {
		// 	word.style.display = 'inline-block';
		// 	word.style.whiteSpace = 'nowrap';
		// });

		console.log('the split', st);

		const chars = st.chars.filter((char) => char.textContent.trim() !== '');

		console.log('the chars --->', chars);

		chars.forEach((char, i) => {
			gsap.to(char, {
				opacity: 1,
				duration: 0.8,
				delay: i * 0.008,
				scrambleText: {
					text: char.textContent,
					chars: '0123456789',
					speed: 1
				}
			});
		});
	});

	// onMount(() => {
	// 	// check if span is already in viewport. if not, wait until user scrolls to animate
	// 	const rect = element.getBoundingClientRect();
	// 	const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

	// 	console.log('jus the element', element);
	// 	console.log('the elements text', element.textContent);

	// 	let st = SplitText.create(element.textContent, { type: 'chars' });

	// 	console.log('the split', st);

	// 	if (isInViewport) {
	// 		st.chars.forEach((char) => {
	// 			gsap.to(char, {
	// 				duration: 1,
	// 				scrambleText: {
	// 					text: text,
	// 					chars: '0123456789',
	// 					speed: 0.5
	// 				}
	// 			});
	// 		});
	// 	} else {
	// 		gsap.to(element, {
	// 			duration: 1.5,
	// 			scrambleText: {
	// 				text: text,
	// 				chars: '0123456789',
	// 				speed: 0.5
	// 			},
	// 			scrollTrigger: {
	// 				trigger: element,
	// 				start: 'bottom 75%',
	// 				toggleActions: 'restart none none none'
	// 			}
	// 		});
	// 	}
	// });
</script>

<span bind:this={element} class="{className} min-h-full w-full">
	{text}
</span>
