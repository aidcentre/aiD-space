<script lang="ts">
	import type { PageProps } from './$types';
	import ChatBar from '$lib/chat/ChatBar.svelte';
	import ChatBubble from '$lib/chat/ChatBubble.svelte';
	import { onMount } from 'svelte';
	import Header from '$lib/ui/Header.svelte';
	import ResearcherCard from '$lib/chat/ResearcherCard.svelte';

	interface Message {
		role: 'user' | 'ai';
		content: string;
		researchers?: string[];
	}

	let messages = $state<Message[]>([]);
	// data passed in from +page.ts into this directory:
	let { data }: PageProps = $props();

	async function get_llm_response(query: string) {
		console.log('messages??!! check that length not equal to 0 -----> ', messages);
		const q = messages.length === 0 ? data.query : query;
		console.log('ok so then what is query?', query);
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

			messages.push({
				role: 'ai',
				content: llmResponse.text_answer,
				researchers: llmResponse.most_relevant_researchers
			});
			return;
		} catch (err) {
			console.error('Error retrieving LLM response: ', err);
			throw err;
		}
	}

	onMount(() => {
		get_llm_response('');
	});
</script>

<Header />

<main class="flex min-h-screen flex-col">
	<section class="mx-auto max-w-230 flex-1 p-4">
		<!-- <div class="mt-20 flex flex-col gap-12 md:gap-20">
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
			<ResearcherCard
				name="Magnus Stalhane"
				description="Professor, Department of Industrial Economics and Technology Management"
				score="9.28"
			/> -->

		<div class="mt-20 flex flex-col">
			{#each messages as msg}
				<ChatBubble role={msg.role} content={msg.content} researchers={msg.researchers} />
			{/each}
		</div>
		<!-- </div> -->
	</section>
</main>

<ChatBar onsubmit={get_llm_response} />
