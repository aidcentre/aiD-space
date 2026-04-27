<script lang="ts">
	let { label, white = false } = $props();

	// svelte-ignore non_reactive_update
	let textColor: string;
	// svelte-ignore non_reactive_update
	let arrowClass: string;
	// svelte-ignore state_referenced_locally
	white ? (textColor = 'var(--light-grey)') : (textColor = 'var(--off-black)');
	// svelte-ignore state_referenced_locally
	white ? (arrowClass = 'link-with-arrow-white') : (arrowClass = 'link-with-arrow-black');
</script>

<!-- TODO: add prop to pass in nav link once they've been decided -->
<a
	class="{arrowClass} w-fit cursor-pointer items-center gap-1 font-[Montagu_Slab] text-[1rem] leading-[1.5rem] font-normal tracking-[0.32px] text-wrap underline underline-offset-4"
	class:text-(--light-grey)={white}
	class:text-(--off-black)={!white}
	href="https://www.forskningsradet.no/en/research-policy-strategy/ltp/artificial-intelligence/"
	target="_blank"
	>{label}
</a>

<style>
	.link-with-arrow-black::after {
		content: url('$lib/assets/arrow_up_right_black.svg');
		display: inline-flex;
		align-items: bottom;
		height: 12px;
		width: 12px;
		padding-left: 0.25rem;
	}
	.link-with-arrow-white::after {
		content: url('$lib/assets/arrow_up_right_white.svg');
		display: inline-flex;
		align-items: bottom;
		height: 12px;
		width: 12px;
		padding-left: 0.25rem;
	}
</style>
