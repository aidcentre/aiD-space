<script>
	let { section_id = '', section_ref = '', alignment = 'left', marginValue = 0, label } = $props();
</script>

<a
	class="section-title btn flex drop-shadow-none"
	style:float={alignment}
	style="margin-{alignment}: {marginValue}%"
	id={section_id}
	href="#{section_ref}">{label}</a
>

<style>
	.section-title {
		background: var(--off-black);
		color: var(--light-grey);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.8rem;
	}
</style>
