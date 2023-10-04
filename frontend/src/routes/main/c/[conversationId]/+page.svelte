<script lang="ts">
import dayjs from "dayjs";
	import ChatMessage from "$lib/components/chat/chat-message/ChatMessage.svelte";
	import { addMessage, chatStore } from "$lib/stores/chat";
	import { fetchMessages } from "$lib/usecases/chat/fetch-messages";
	import { PaperAirplane } from "svelte-hero-icons";
	import ChatInput from "$lib/components/chat/chat-input/ChatInput.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { afterUpdate, onMount } from "svelte";
	import { openRealtimeConnection, realtimeStore } from "$lib/stores/realtime";
	import { agentStore } from "$lib/stores/agent";
	import { mainContextStore } from "$lib/stores/main-context";
	import { authStore } from "$lib/stores/auth";
	    import Typewriter from 'svelte-typewriter'
	export let data: { conversationId: string };

	let typingMessageIndex = -1;
	let preloadedMessageCount = 0;

	const load = async (conversationId: string) => {
		const messages = await fetchMessages(conversationId);

		preloadedMessageCount = messages.length;
	}
	
	let inputValue = "";

	const sendMessage = (e: Event) => {
		e.stopPropagation();
		e.preventDefault();

		const con = $realtimeStore.connection;

		if (!con) {
			return;
		}

		con.emit('chat-message', {
			data: {
				text: inputValue,
				conversationId: data.conversationId
			}
		}, (ack: any) => {
			if (!ack.error) {
				addMessage(ack.data);
			}
		})

		inputValue = "";
	}

	onMount(async () => {
		const agent = $agentStore.selectedAgent;
		const project =  $mainContextStore.publicProjectConfig;
		const member = $authStore.member;

		if (!agent || !project || !member) {
			return;
		}

		const con  = await openRealtimeConnection(project.id, agent.id, member.id);
		
		con.on('chat-message', (payload) => {
			addMessage(payload.data);
		})
	})


	$: load(data.conversationId);
	$: messages = $chatStore.messages;

	let chatElement: HTMLDivElement;

	afterUpdate(() => {
		if (chatElement) {
			chatElement.scrollTo(0, chatElement.scrollHeight);
		}
	})

	$: console.log(messages);
</script>

<div class="flex flex-col justify-between relative h-full">
<div 
bind:this={chatElement}
class="absolute top-0 bottom-[80px] left-0 right-0 overflow-y-scroll bg-background-primary dark:bg-background-secondary-dark">
		{#if messages?.length > 0}
			<div class="flex flex-col grow gap-4 py-4 px-3 items-start">
				{#each messages as message, idx}
					<div class="w-full">
						<ChatMessage
							typewriter={idx === messages.length - 1}
							from={message.source === 'USER' ? 'user' : message.source === 'AGENT' ? 'agent' : 'system'}
							time={dayjs(message.createdAt).format("hh:mm A")}
							body={message.text} />
					</div>
				{/each}
			</div>
		{/if}
</div>
<div
		class="absolute bottom-0 left-0 right-0 flex items-center justify-center py-3 px-3 border-t border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-primary-dark flex-grow-0">
		<div class="flex-grow max-w-4xl">
			<div class="flex items-center justify-between gap-3">
				<form class="w-full" on:submit={sendMessage}>
					<ChatInput
						bind:value={inputValue}
						name="chat-input"
						placeholder="Send a message" />
				</form>
				<div class="h-full flex">
					<Button submit rightIcon={PaperAirplane} on:click={sendMessage} />
				</div>
			</div>
		</div>
	</div>

</div>
