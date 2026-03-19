<script lang="ts">
	let userQuery = $state();
	let message = $state();

	async function roll() {
		const request = new Request('/chat', {
			method: 'POST',
			body: JSON.stringify({ userQuery }),
			headers: { 'Content-Type': 'application/json' }
		});

		const response = await fetch(request);
		const data = await response.json();

		message = data;
	}
</script>

<input
	bind:value={userQuery}
	type="text"
	placeholder="Find a scientist"
	class="w-200 cursor-text rounded-lg border-none bg-white py-3 pr-14 pl-4 focus:outline-none"
/>

<button onclick={roll}>Press me to roll</button>

{#if message !== undefined}
	<p>RESULT OF THE API CALL: {message}</p>
{/if}
