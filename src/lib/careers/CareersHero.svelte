<script lang="ts">
	import Scramble from '$lib/actions/Scramble.svelte';
	import CareersCards from './CareersCards.svelte';
</script>

<section>
	<div class="grid grid-cols-12 gap-8 lg:gap-12 max-w-[1920px] px-4 mx-auto pt-30 md:pt-40 lg:pt-60 mb-30 md:mb-40 lg:mb-60">
		<div class="bg-size-auto h-8 col-span-12 bg-[url('/src/lib/assets/diagonal_squares_black.svg')] bg-repeat-x pointer-events-none"></div>
		<div class="col-span-12 md:col-span-5">
			<Scramble
				text="Careers"
				speed="slow"
				class="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight"
			/>
		</div>
		<div class="col-span-12 md:col-span-7">
			<CareersCards />
		</div>
	</div>
</section>