<script lang="ts">
	let { label, white = false } = $props();

	let borderColor: string;
	white ? (borderColor = 'border-(--light-grey)') : (borderColor = 'border-off-black');
</script>

<!-- TODO: add prop to pass in nav link once they've been decided -->
<a
	class="flex w-fit cursor-pointer flex-nowrap items-center gap-1 border-b border-solid {borderColor} font-[Montagu_Slab] text-[1rem] leading-[1.5rem] font-normal tracking-[0.32px]"
	class:text-(--light-grey)={white}
	class:text-(--off-black)={!white}
	href="https://www.forskningsradet.no/en/research-policy-strategy/ltp/artificial-intelligence/"
	target="_blank"
	>{label}
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="butt"
			stroke-linejoin="miter"
			stroke-miterlimit="10"
			d="M 13.005208 3 L 3.005208 13 "
			transform="matrix(0.75,0,0,0.75,0,0)"
		/>
		<path
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="butt"
			stroke-linejoin="miter"
			stroke-miterlimit="10"
			d="M 13 9.875 L 13 3 L 6.125 3 "
			transform="matrix(0.75,0,0,0.75,0,0)"
		/></svg
	>
</a>
