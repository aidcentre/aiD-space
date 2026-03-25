<script lang="ts">
	let {
		label,
		link
	}: {
		label: string;
		link: string;
	} = $props();
</script>

<a
	class="group overflow-hidden flex gap-3 lg:gap-4 bg-darker-grey text-white p-4 md:p-5 lg:p-6 w-56 md:w-64 lg:w-80 aspect-3/2 text-lg lg:text-xl xl:text-2xl font-bold rounded-lg select-none hover:bg-white hover:text-off-black transition-colors duration-800 ease-out-expo"
	href="/{link}"
>
	<div class="hidden md:block w-4.5 h-4.5 lg:w-5 lg:h-5 xl:w-5.5 xl:h-5.5 aspect-square rounded translate-y-1 scale-0 -ml-7 lg:-ml-9 group-hover:ml-0 group-hover:bg-off-black group-hover:scale-100 transition-ml duration-800 ease-out-expo"></div>
	{label}
</a>