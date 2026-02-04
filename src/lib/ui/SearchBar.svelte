<script>
	import '../../routes/layout.css';
	let query = $state('');
</script>


<!-- note: make text in input box wrap? if so, where does the extra? -->
<div class="search-box">
	<div class="textbox-label">
		<span>Find a scientist</span><span style:color="#969696">Search for a research topic, name or anything else</span>
	</div>
	<label class="text-box input">
		<input value={query} type="search" required placeholder="Search" />
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
	.search-box {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		font-family: 'Milling';
		width: 40%;
		max-width: 1000px;
	}
	.textbox-label {
		display: flex;
		justify-content: space-between;
		color: #e8e8e8;
		font-size: 0.8rem;
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
		width:auto;
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
