<script lang="ts">
import dayjs from "dayjs";
import ChatMessage from "$lib/components/chat/chat-message/ChatMessage.svelte";
import { addMessage, chatStore, addStreamedMessageToken } from "$lib/stores/chat";
import { fetchMessages } from "$lib/usecases/chat/fetch-messages";
import { PaperAirplane } from "svelte-hero-icons";
import ChatInput from "$lib/components/chat/chat-input/ChatInput.svelte";
import Button from "$lib/components/common/button/Button.svelte";
import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
import { realtimeStore } from "$lib/stores/realtime";
import { conversationStore } from "$lib/stores/conversation";

export let data: { conversationId: string };
export let isWaitingForAnswer = false

let chatElement: HTMLDivElement;
let inputValue = "";

const load = async (conversationId: string) => {
	$conversationStore.selectedConversationId = conversationId;
	await fetchMessages(conversationId);
	inputElement?.focus()
}

const sendMessage = (e: Event) => {
	e.preventDefault();

	const con = $realtimeStore.connection;

	if (!con) {
		return;
	}

	const payload = {
		data: {
			text: inputValue,
			conversationId: data.conversationId,
			source: 'USER' as 'USER' | 'AGENT' | 'SYSTEM',
		}
	}

	chatElement.scrollTop = chatElement.scrollHeight;

	addMessage(payload.data);
	
	isWaitingForAnswer = true;
	con.emit('chat-message', payload);

	inputValue = "";

}

const listenToStreamChatMessageEnd = () => {
	isWaitingForAnswer = false;
}

const listenToChatMessage = (payload: any) => {
	if (payload.data.conversationId !== data.conversationId) {
		console.warn(`Received message for conversation ${payload.data.conversationId} but current conversation is ${data.conversationId}`)

		return;
	}

	isWaitingForAnswer = false;
	addMessage(payload.data);
}

const listenToStreamedChatMessageToken = (payload: any) => {
	if (payload.data.conversationId !== data.conversationId) {
		console.warn(`Received message for conversation ${payload.data.conversationId} but current conversation is ${data.conversationId}`)

		return;
	}

	addStreamedMessageToken({
			id: payload.data.messageId,
			text: payload.data.text,
			source: 'AGENT',
			createdAt: payload.timestamp
	});
}

onMount(async () => {
	$realtimeStore.connection?.on('chat-message', listenToChatMessage);
	$realtimeStore.connection?.on('stream-chat-message-token', listenToStreamedChatMessageToken);
	$realtimeStore.connection?.on('stream-chat-message-end', listenToStreamChatMessageEnd);
})

onDestroy(() => {
	$realtimeStore.connection?.off('chat-message', listenToChatMessage);
	$realtimeStore.connection?.off('stream-chat-message-token', listenToStreamedChatMessageToken);
	$realtimeStore.connection?.off('stream-chat-message-end', listenToStreamChatMessageEnd);
})


$: load(data.conversationId);
$: messages = $chatStore.messages;

let chatElementScrollHeight = 0;
let chatElementScrollTop = 0;
let chatElementClientHeight = 0;

beforeUpdate(() => {
	if (chatElement) {
		chatElementScrollHeight = chatElement.scrollHeight;
		chatElementScrollTop = chatElement.scrollTop;
		chatElementClientHeight = chatElement.clientHeight;
	}
})

afterUpdate(() => {
	if (chatElement) {
		// if chat element is scrolled to the bottom, scroll to the bottom again
		if (chatElementScrollHeight - chatElementScrollTop === chatElementClientHeight) {
			chatElement.scrollTop = chatElement.scrollHeight;
		}
	}
})

let inputElement: HTMLInputElement;


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
							from={message.source}
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
				<form class="w-full items-center flex gap-3" on:submit|preventDefault={sendMessage}>
					<div class="flex-1">
					<ChatInput
						bind:inputElement={inputElement}
						bind:value={inputValue}
						name="chat-input"
						placeholder="Send a message" />
						</div>
						<Button submit loading={isWaitingForAnswer} disabled={isWaitingForAnswer || inputValue === ''} rightIcon={PaperAirplane} />
				</form>
		</div>
	</div>

</div>
