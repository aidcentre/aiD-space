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
	<div
		class="ease-out-expo pointer-events-auto fixed top-4 right-4 left-4 z-40 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl py-2 pr-2 pl-4 transition-colors duration-800 {open
			? 'bg-off-black'
			: 'bg-white'}"
	>
		<a href="/">
			<Logo theme={open ? 'light' : 'dark'} />
		</a>
		<MenuButton {open} onclick={() => (open = !open)} />
	</div>
</header>