<script lang="ts">
	import MenuButton from './MenuButton.svelte';
	import Logo from './Logo.svelte';
	import { menuOpen } from '$lib/stores/menu';

	let open = $state(false);

	$effect(() => {
		menuOpen.set(open);
	});
</script>

<header>
	<div class="fixed top-4 left-4 right-4 z-40 flex items-center justify-between py-2 pl-4 pr-2 w-[calc(100%-2rem)] rounded-xl pointer-events-auto transition-colors duration-800 ease-out-expo {open ? 'bg-off-black' : 'bg-white'}">
		<a href="/">
			<Logo theme={open ? 'light' : 'dark'} />
		</a>
		<MenuButton {open} onclick={() => (open = !open)} />
	</div>
</header>