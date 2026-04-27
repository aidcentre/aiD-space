<script lang="ts">
	import type { PageProps } from './$types';
	import ChatBar from '$lib/chat/ChatBar.svelte';
	import ChatBubble from '$lib/chat/ChatBubble.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/ui/Header.svelte';
	import Scramble from '$lib/actions/Scramble.svelte';

	interface Message {
		role: 'user' | 'ai';
		content: string;
		researchers?: [string, number][];
		researcherInfo?: string[];
		isError?: boolean;
	}

	let messages = $state<Message[]>([]);
	let { data }: PageProps = $props();
	async function get_llm_response(query: string) {
		const q = query || data.query;
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

			const response = await fetch(request);
			if (!response.ok) {
				console.error('Error retrieving LLM response: status', response.status);
				messages.push({ role: 'ai', content: '', isError: true });
				return;
			}
			const llmResponse = await response.json();
			console.log('5. llm response in chat/+page.svelte', llmResponse);

			if (llmResponse.error) {
				console.error('Error retrieving LLM response: error in response');
				messages.push({ role: 'ai', content: '', isError: true });
				return;
			}

			messages.push({
				role: 'ai',
				content: llmResponse.text_answer,
				researchers: llmResponse.most_relevant_researchers,
				researcherInfo: llmResponse.general_researcher_information
			});
			return;
		} catch (err) {
			console.error('Error retrieving LLM response: ', err);
			messages.push({ role: 'ai', content: '', isError: true });
		}
	}

	onMount(() => {
		get_llm_response('');
	});
</script>

<Header />

<main class="flex min-h-screen flex-col">
	<section class="mx-auto w-screen max-w-230 flex-1 p-4">
		<div class="mt-20 flex flex-col">
			{#each messages as msg}
				<ChatBubble
					role={msg.role}
					content={msg.content}
					researchers={msg.researchers}
					isError={msg.isError}
					onnewchat={() => {
						messages = [];
						goto('/chat', { replaceState: true });
					}}
				/>
			{/each}
		</div>
		{#if messages[messages.length - 1] && messages[messages.length - 1].role === 'user'}
			<Scramble
				text="Please wait! Getting your response."
				speed="slow"
				loop={1500}
				class="mb-20 font-[IBM_Mono]"
			/>
		{/if}
	</section>
</main>

<ChatBar onsubmit={get_llm_response} />

<style>
	@keyframes waiting-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.2;
		}
	}
	:global(.animate-waiting) {
		animation: waiting-pulse 3s ease-in-out infinite;
	}
</style>
