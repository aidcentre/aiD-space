<script lang="ts">
	let { label } = $props();
</script>

<!-- TODO: add prop to pass in nav link once they've been decided -->
<a
	class="nav-button flex w-max items-center gap-3 bg-white text-[0.8rem] font-bold text-(--off-black) drop-shadow-none hover:bg-(--light-grey)"
	id="impact-and-use-cases"
	href="https://ecmiindmath.org/2025/02/07/aid-ai-for-decisions/"
	target="_blank"
	>{label}
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			xmlns="http://www.w3.org/2000/svg"
			style="fill:none;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(1.960784%,1.960784%,1.960784%);stroke-opacity:1;stroke-miterlimit:10;"
			d="M 13.005208 3 L 3.005208 13 "
			transform="matrix(0.75,0,0,0.75,0,0)"
		/>
		<path
			xmlns="http://www.w3.org/2000/svg"
			style="fill:none;stroke-width:1.5;stroke-linecap:butt;stroke-linejoin:miter;stroke:rgb(1.960784%,1.960784%,1.960784%);stroke-opacity:1;stroke-miterlimit:10;"
			d="M 13 9.875 L 13 3 L 6.125 3 "
			transform="matrix(0.75,0,0,0.75,0,0)"
		/></svg
	>
</a>

<style>
	.nav-button {
		border-radius: 0.5rem;
		padding: 0.6rem 1rem;
	}
</style>
