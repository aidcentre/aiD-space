<script lang="ts">
	import ButtonWithArrow from './ButtonWithArrow.svelte';
</script>

<section class="mt-20 flex w-full flex-col items-center justify-center">
	<div class="flex w-1/2 flex-col justify-start gap-8">
		<p class="text-4xl font-extrabold">About & contact</p>
		<p class="font-[Montagu_Slab] text-lg font-normal tracking-tight">
			aiD is headquartered at the Norwegian University of Science and Technology in Trondheim,
			Norway and at SINTEF, Norway.
		</p>
		<div class="-mt-4 flex flex-col">
			<span class="text-sm font-bold">info@aid-research.com</span>
			<span class="mt-1 text-sm font-bold">+47 22 22 55 55</span>
		</div>
		<div class="flex gap-2">
			<ButtonWithArrow label="aiD at NTNU" />
			<ButtonWithArrow label="aiD at SINTEF" />
		</div>
	</div>
</section>

<style>
</style>
