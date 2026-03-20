<script lang="ts">
	import type { PageProps } from './$types';

	let userQuery = $state();
	let message = $state();
	// data passed in from +page.ts in this directory
	let { data }: PageProps = $props();

	async function roll() {
		let q = data.query;
		console.log('3. user query in +page chat, transferred successfully', q);
		const request = new Request('/chat', {
			method: 'POST',
			body: JSON.stringify({ q }),
			headers: { 'Content-Type': 'application/json; charset=UTF-8' }
		});

		const response = await fetch(request);
		const lmmAnswer = await response.json();
		console.log('5. llm response in +page chat', lmmAnswer);

		message = lmmAnswer;
	}
</script>

<input
	type="text"
	placeholder="Find a scientist"
	class="w-200 cursor-text rounded-lg border-none bg-white py-3 pr-14 pl-4 focus:outline-none"
/>

<button onclick={roll}>Press me to roll</button>

{#if message !== undefined}
	<p>RESULT OF THE API CALL: {message}</p>
{/if}
