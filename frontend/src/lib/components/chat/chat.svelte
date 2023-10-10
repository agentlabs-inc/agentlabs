<script lang="ts">
	import { addMessage, addStreamedMessageToken, chatStore } from "$lib/stores/chat";
	import { PaperAirplane } from "svelte-hero-icons";
	import Button from "../common/button/Button.svelte";
	import ChatInput from "./chat-input/ChatInput.svelte";
	import ChatMessage from "./chat-message/ChatMessage.svelte";
	import dayjs from "dayjs";
	import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
	import { addConversation, conversationStore, generateConversationId } from "$lib/stores/conversation";
	import { realtimeStore } from "$lib/stores/realtime";
	import { afterNavigate, goto } from "$app/navigation";
	import { agentStore } from "$lib/stores/agent";
	import { authStore } from "$lib/stores/auth";

	let chatElement: HTMLDivElement;
	let chatInputElement: HTMLInputElement;
	let isWaitingForAnswer = false;
	let chatInputValue = '';
	
	$: agentId = $agentStore.selectedAgent?.id;
	$: memberId = $authStore.member?.id;

	$: isChatInputDisabled = isWaitingForAnswer || chatInputValue === '';

	$: messages = $chatStore.messages;
	$: conversationId = $conversationStore.selectedConversationId;


	

	let shouldRedirectToConversation = false;

	const sendMessage = (e: Event) => {
		e.preventDefault();

		const con = $realtimeStore.connection;

		if (!con) {
			return;
		}

		if (!conversationId) {
			shouldRedirectToConversation = true;
		}

		const actualConversationId = conversationId ?? generateConversationId();

		const payload = {
			data: {
				text: chatInputValue,
				conversationId: actualConversationId,
				source: 'USER' as 'USER' | 'AGENT' | 'SYSTEM',
			}
		}

		chatElement.scrollTop = chatElement.scrollHeight;

		addMessage(payload.data);
		
		isWaitingForAnswer = true;
		$conversationStore.selectedConversationId = actualConversationId;
		con.emit('chat-message', payload);

		chatInputValue = "";
	}

	const makeConversation = async () => {
		if (!agentId || !memberId || !conversationId) {
			return;
		}

		const timestamp = new Date().toISOString();

		addConversation({
				id: conversationId,
				agentId,
				memberId,
				createdAt: timestamp,
				updatedAt: timestamp,
		})
		await goto(`/main/c/${conversationId}`);
	}

	const listenToStreamChatMessageEnd = () => {
		isWaitingForAnswer = false;

		if (shouldRedirectToConversation) {
			makeConversation();
			shouldRedirectToConversation = false;
		}
	}

	const listenToChatMessage = (payload: any) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`)

			return;
		}

		if (shouldRedirectToConversation) {
			makeConversation();
			shouldRedirectToConversation = false;
		}

		isWaitingForAnswer = false;
		addMessage(payload.data);
	}

	const listenToStreamedChatMessageToken = (payload: any) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`)

			return;
		}

		addStreamedMessageToken({
				id: payload.data.messageId,
				text: payload.data.text,
				source: 'AGENT',
				createdAt: payload.timestamp
		});
	}

	afterNavigate(() => {
			chatInputElement?.focus();
	})

	$: if (chatInputElement) {
		chatInputElement.focus();
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
		$realtimeStore.connection?.disconnect()
	})

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
							bind:inputElement={chatInputElement}
							bind:value={chatInputValue}
							name="chat-input"
							placeholder="Send a message"
						/>
					</div>
						<Button submit loading={isWaitingForAnswer} disabled={isChatInputDisabled} rightIcon={PaperAirplane} />
				</form>
		</div>
	</div>
</div>
