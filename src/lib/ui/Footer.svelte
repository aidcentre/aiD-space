<script lang="ts">
	import Link from './Link.svelte';
	import NodeSphere from './NodeSphere.svelte';
	import ToTheTopButton from './ToTheTopButton.svelte';
	import { menuOpen } from '$lib/stores/menu';
</script>

<footer>
	<div class="flex flex-col md:flex-row justify-between items-start relative bg-off-black w-full min-h-80 h-[80vh] p-4 overflow-hidden">
		<div class="md:w-120 flex flex-col gap-8 md:gap-0 justify-between z-20 md:h-full">
			<div class="flex flex-col gap-8">
				<p class="font-family-serif text-sm md:text-base text-white">aiD is headquartered at the Norwegian University of Science and Technology in Trondheim, Norway and at SINTEF, Norway.</p>
				<div class="flex flex-col gap-1">
					<Link 
						href="mailto:info@aid-research.com" 
						theme="dark"
					>
						info@aid-research.com
					</Link>
					<Link 
						href="tel:+47 22 22 55 55" 
						theme="dark"
					>
						+47 22 22 55 55
					</Link>
				</div>
			</div>
			<Link 
				href="https://aid-center.no/" 
				theme="dark"
				border={true}
				trailing={true}
			>
				aiD at The Resarch Council of Norway
			</Link>
		</div>
		<ToTheTopButton onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-mt-16 pointer-events-none z-10 w-full h-full">
			<NodeSphere theme="dark" paused={$menuOpen} />
		</div>
	</div>
</footer>
