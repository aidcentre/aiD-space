<script lang="ts">
	import MenuButton from './MenuButton.svelte';
	import Logo from './Logo.svelte';
	import { menuOpen } from '$lib/stores/menu';

	let open = $state(false);

	$effect(() => {
		menuOpen.set(open);
	});

	// Links inside the menu can close it through the store (e.g. a link to a
	// section of the page that's already open, where nothing remounts).
	$effect(() => {
		if (!$menuOpen) open = false;
	});
</script>

<header>
	<div class="fixed top-4 left-4 right-4 z-40 flex items-center justify-between py-2 pl-4 pr-2 w-[calc(100%-2rem)] rounded-xl pointer-events-auto transition-colors duration-800 ease-out-expo {open ? 'bg-off-black' : 'bg-white'}">
		<a href="/" class="block origin-left transition-transform duration-800 ease-out-expo {open ? 'scale-120' : ''}">
			<Logo theme={open ? 'light' : 'dark'} />
		</a>
		<MenuButton {open} onclick={() => (open = !open)} />
	</div>
</header>