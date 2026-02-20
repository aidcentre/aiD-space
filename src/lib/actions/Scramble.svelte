<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import { onMount } from 'svelte';
	// const { text = '', class: className } = $props();
	const { text, class: className } = $props();

	gsap.registerPlugin(ScrambleTextPlugin);

	let element: HTMLElement;

	onMount(() => {
		gsap.to(element, {
			duration: 1,
			scrambleText: {
				text: text,
				chars: '0123456789',
				speed: 0.5
			}
		});
	});
</script>

<span bind:this={element} class={className}>
	{text}
</span>
