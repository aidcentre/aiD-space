<script lang="ts">
	import type { PageProps } from './$types';

	// types
	interface Message {
		role: 'user' | 'ai';
		content: string;
	}

	let userQuery = $state('');
	let messages = $state<Message[]>([]);
	// data passed in from +page.ts into this directory:
	let { data }: PageProps = $props();

	async function get_llm_response() {
		const q = messages.length === 0 ? data.query : userQuery;
		if (!q) return;

		messages.push({ role: 'user', content: q });
		// reset userQuery after it's recorded in messages
		userQuery = '';

		console.log('3. user query in +page chat, transferred successfully', q);

		try {
			const request = new Request('/chat', {
				method: 'POST',
				body: JSON.stringify({ messages }),
				headers: { 'Content-Type': 'application/json; charset=UTF-8' }
			});

			const llmResponse = await (await fetch(request)).json();
			console.log('5. llm response in chat/+page.svelte', llmResponse);

			// replace llmResponse.tostring() with specifically text_response
			messages.push({ role: 'ai', content: llmResponse.text_answer });
			return;
		} catch (err) {
			console.error('Error retrieving LLM response: ', err);
			throw err;
		}
	}
</script>

<input
	type="text"
	bind:value={userQuery}
	placeholder="Find a scientist"
	class="w-200 cursor-text rounded-lg border-none bg-white py-3 pr-14 pl-4 focus:outline-none"
/>

<button onclick={get_llm_response}>Press me to get response</button>

{#if messages.length > 0 && messages[messages.length - 1].role === 'ai'}
	<p>RESULT OF THE API CALL: {messages[messages.length - 1].content}</p>
{/if}

<!-- scroll to bottom when new message is added -->
