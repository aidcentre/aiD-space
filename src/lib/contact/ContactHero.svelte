<script lang="ts">
	import LogoTemplate from './LogoTemplate.svelte';
	import Scramble from '$lib/actions/Scramble.svelte';
	import Link from '$lib/ui/Link.svelte';

	let projectBy = ['ntnu_logo', 'sintef_logo', 'norway_research_council_logo'];
</script>

<section>
	<div class="grid grid-cols-12 gap-8 lg:gap-12 max-w-[1920px] px-4 mx-auto pt-30 md:pt-40 lg:pt-60 mb-30 md:mb-40 lg:mb-60">
		<div class="bg-size-auto h-8 col-span-12 bg-[url('/src/lib/assets/diagonal_squares_black.svg')] bg-repeat-x pointer-events-none"></div>
		<div class="col-span-12 md:col-span-5">
			<Scramble
				text="About & contact"
				speed="slow"
				class="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight"
			/>
		</div>
		<div class="col-span-12 md:col-span-7">
			<div class="flex flex-col gap-12">
				<p class="text-sm md:text-md lg:text-lg font-family-serif text-off-black">aiD is headquartered at the Norwegian University of Science and Technology in Trondheim, Norway and at SINTEF, Norway.</p>
				<div class="flex flex-col">
					<div class="flex gap-2 mb-2">
						<div class="w-3.75 h-3.75 aspect-square rounded translate-y-1 md:translate-y-1 bg-off-black"></div>
						<Scramble 
							text="Contact"
							speed="slow"
							class="font-bold text-off-black" 
						/>
					</div>
					<Link 
						href="mailto:info@aid-research.com" 
						theme="light"
					>
						info@aid-research.com
					</Link>
					<Link 
						href="tel:+47 22 22 55 55" 
						theme="light"
					>
						+47 22 22 55 55
					</Link>
					<Link 
						href="https://aid-center.no/" 
						theme="light"
						border={true}
						trailing={true}
					>
						aiD at The Resarch Council of Norway
					</Link>
				</div>
				<div class="flex flex-col">
					<div class="flex gap-2 mb-2">
						<div class="w-3.75 h-3.75 aspect-square rounded translate-y-1 md:translate-y-1 bg-off-black"></div>
						<Scramble 
							text="Are you a partner?" 
							class="font-bold text-off-black" 
						/>
					</div>
					<Link 
						href="https://aid-center.no/" 
						theme="light"
						border={true}
						trailing={true}
					>
						Are you a partner?
					</Link>
				</div>
				<div class="flex flex-col">
					<div class="flex gap-2 mb-2">
						<div class="w-3.75 h-3.75 aspect-square rounded translate-y-1 md:translate-y-1 bg-off-black"></div>
						<Scramble 
							text="A project by" 
							class="font-bold text-off-black" 
						/>
					</div>
					<div class="mt-3 flex flex-wrap gap-4 md:gap-6 lg:gap-8">
						{#each projectBy as orgName}
							<LogoTemplate name={orgName} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>