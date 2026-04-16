<script lang="ts">
	import type { PageProps } from './$types';
	import ChatBar from '$lib/chat/ChatBar.svelte';
	import ChatBubble from '$lib/chat/ChatBubble.svelte';
	import { onMount } from 'svelte';
	import Header from '$lib/ui/Header.svelte';

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

<Header />

<main class="mx-auto max-w-230 p-4">
	<div class="mt-20 flex flex-col gap-12 md:gap-20">
		<ChatBubble role={'user'} content={'Show me mathematicians'} />
		<ChatBubble
			role={'ai'}
			content={'For queries related to mathematics, Mark Haring would be the most relevant researcher. His work on the stability bounds of Kalman filters and input-to-state stability provides a strong mathematical foundation in these areas. If your math question pertains to these topics or related systems theory, he would be well suited to assist.'}
		/>
		<ChatBubble role={'user'} content={'Show me mathematicians'} />
		<ChatBubble
			role={'ai'}
			content={'For queries related to mathematics, Mark Haring would be the most relevant researcher. His work on the stability bounds of Kalman filters and input-to-state stability provides a strong mathematical foundation in these areas. If your math question pertains to these topics or related systems theory, he would be well suited to assist.'}
		/>
		<ChatBubble role={'user'} content={'Show me mathematicians'} />
		<ChatBubble
			role={'ai'}
			content={'For queries related to mathematics, Mark Haring would be the most relevant researcher. His work on the stability bounds of Kalman filters and input-to-state stability provides a strong mathematical foundation in these areas. If your math question pertains to these topics or related systems theory, he would be well suited to assist.'}
		/>
	</div>
	<!-- 
	{#each messages as msg}
		<div class="flex flex-col">
			<ChatBubble role={msg.role} content={msg.content} />
		</div>
	{/each} -->
</main>

<ChatBar onsubmit={get_llm_response} />
