<script>
	import '../../routes/layout.css';
	let query = $state('');
</script>

<!-- note: make text in input box wrap? if so, where does the extra go? -->
<div class="search-box">
	<div class="textbox-label">
		<span>Find a scientist</span><span class="textbox-label-search"
			>Search for a research topic, name or anything else</span
		>
	</div>
	<label class="text-box input">
		<input class="form-control" value={query} type="text" required placeholder="Your query" />
		<div class="search-icon">
			<svg class="h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" stroke="#050505">
				<g stroke-linejoin="round" stroke-linecap="round" stroke-width="3.5" fill="none">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m24 24-7-7"></path>
				</g>
			</svg>
		</div>
	</label>
</div>

<!-- <h1 style:color="red">Hello {query}!!!</h1> -->

<style>
	/* prevent blue outline around input text box */
	.form-control:focus {
		box-shadow: none !important;
		-moz-box-shadow: none !important;
		-webkit-box-shadow: none !important;
	}
	.search-box {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		width: 36rem;
		max-width: 1000px;
		position: fixed;
		top: 50%;
		left: 50%;
		/* to account for the width of the component (top left corner is placed in the middle): */
		transform: translate(-50%, -50%);
	}
	.textbox-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #e8e8e8;
		font-size: 0.8rem;
	}
	.textbox-label-search {
		color: #969696;
		font-family: 'Montagu Slab';
		font-weight: 40;
		font-size: 0.7rem;
	}
	.text-box {
		background: #050505;
		color: #969696;
		display: flex;
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		align-items: center;
		gap: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid #3f3f3f;
		height: 3rem;
		width: auto;
	}
	.search-icon {
		display: flex;
		padding: 0.5rem;
		align-items: center;
		gap: 0.375rem;
		border-radius: 0.375rem;
		background: #e8e8e8;
	}
</style>
