<script lang="ts">
	import Link from './Link.svelte';
	import NodeSphere from './NodeSphere.svelte';
	import ToTheTopButton from './ToTheTopButton.svelte';
	import { menuOpen } from '$lib/stores/menu';
</script>

<footer>
	<div
		class="relative flex h-[80vh] min-h-80 w-full flex-col items-start justify-between overflow-hidden bg-off-black p-4 md:flex-row"
	>
		<div class="z-20 flex flex-col justify-between gap-8 md:h-full md:w-120 md:gap-0">
			<div class="flex flex-col gap-8">
				<p class="font-family-serif text-sm text-white md:text-base">
					aiD is headquartered at the Norwegian University of Science and Technology in Trondheim,
					Norway and at SINTEF, Norway.
				</p>
				<div class="flex flex-col gap-1">
					<Link href="mailto:iben.nesset@sintef.no" theme="dark">iben.nesset@sintef.no</Link>
					<Link href="tel:+47 91 71 31 84" theme="dark">+47 91 71 31 84</Link>
				</div>
			</div>
			<Link href="https://aid-center.no/" theme="dark" border={true} trailing={true}>
				aiD at the Research Council of Norway
			</Link>
		</div>
		<ToTheTopButton onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
		<div
			class="pointer-events-none absolute top-1/2 left-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 md:-mt-16"
		>
			<NodeSphere theme="dark" paused={$menuOpen} />
		</div>
	</div>
</footer>
