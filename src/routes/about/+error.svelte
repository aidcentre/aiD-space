<script lang="ts">
  import Header from '$lib/ui/Header.svelte';
  import Menu from '$lib/ui/Menu.svelte';
  import Error from '$lib/ui/Error.svelte';
  import NodeSphere from '$lib/ui/NodeSphere.svelte';
  import { menuOpen } from '$lib/stores/menu';
</script>

<div class="fixed inset-0 -mt-24 pointer-events-none">
	<NodeSphere paused={$menuOpen} />
</div>

<Header />
<Menu />

<main>
  <Error />
</main>