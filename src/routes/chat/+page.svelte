<script lang="ts">
	import type { PageProps } from './$types';
	import ChatBar from '$lib/chat/ChatBar.svelte';

	interface Message {
		role: 'user' | 'ai';
		content: string;
	}

	let messages = $state<Message[]>([]);
	// data passed in from +page.ts into this directory:
	let { data }: PageProps = $props();

	async function get_llm_response(query: string) {
		const q = messages.length === 0 ? data.query : query;
		if (!q) return;

		messages.push({ role: 'user', content: q });

		console.log('3. user query in +page chat, transferred successfully', q);

		try {
			const request = new Request('/chat', {
				method: 'POST',
				body: JSON.stringify({ messages }),
				headers: { 'Content-Type': 'application/json; charset=UTF-8' }
			});

			const llmResponse = await (await fetch(request)).json();
			console.log('5. llm response in chat/+page.svelte', llmResponse);

			messages.push({ role: 'ai', content: llmResponse.text_answer });
			return;
		} catch (err) {
			console.error('Error retrieving LLM response: ', err);
			throw err;
		}
	}

	// onMount(() => {
	// 	get_llm_response('');
	// });
</script>

<main></main>

<ChatBar onsubmit={get_llm_response} />

{#if messages.length > 0 && messages[messages.length - 1].role === 'ai'}
	<p>RESULT OF THE API CALL: {messages[messages.length - 1].content}</p>
{/if}
