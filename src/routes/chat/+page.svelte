<script lang="ts">
	import type { PageProps } from './$types';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { onMount } from 'svelte';

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

	onMount(() => {
		get_llm_response();
	});
</script>

<div
	class="group absolute bottom-4 left-1/2 -mt-8 flex w-full max-w-214 -translate-x-1/2 -translate-y-1/2 flex-col gap-3 px-4"
>
	<form
		method="POST"
		action="/"
		class="relative flex w-full cursor-pointer flex-col rounded-xl bg-white"
	>
		<div
			class="font-family-mono text-grey relative flex items-center justify-between px-3 py-3 text-xs select-none md:px-4 md:py-3 md:text-sm lg:text-base"
		>
			<input
				bind:value={userQuery}
				name="userQuery"
				type="text"
				placeholder="Your query"
				class="font-family-mono text-grey w-full cursor-text rounded-lg border-none bg-white p-0 text-xs font-light focus:outline-none md:text-sm lg:text-base"
			/>
			<button
				class="ease-out-expo pointer-events-auto absolute top-1/2 right-2 flex aspect-square -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-off-black p-1.5 leading-0 text-white transition-colors duration-800 group-hover:bg-light-grey md:p-2"
				aria-label="Search scientists // Research topics, names or anything else"
				onclick={get_llm_response}
			>
				<ArrowRightIcon
					class="ease-out-expo h-3 w-3 transition-colors duration-800 group-hover:fill-off-black lg:h-4 lg:w-4"
				/>
			</button>
		</div>
	</form>
</div>

{#if messages.length > 0 && messages[messages.length - 1].role === 'ai'}
	<p>RESULT OF THE API CALL: {messages[messages.length - 1].content}</p>
{/if}

<!-- scroll to bottom when new message is added -->
<style>
	input:focus {
		box-shadow: none !important;
		outline: none;
	}
</style>
