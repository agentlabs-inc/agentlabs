<script lang="ts">
	import {
		addActiveStream,
		addMessage,
		addStreamedMessageToken,
		chatStore,
		isStreaming,
		removeActiveStream
	} from "$lib/stores/chat";
	import { PaperAirplane } from "svelte-hero-icons";
	import Button from "../common/button/Button.svelte";
	import ChatInput from "./chat-input/ChatInput.svelte";
	import ChatMessage from "./chat-message/ChatMessage.svelte";
	import dayjs from "dayjs";
	import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
	import {
		addConversation,
		conversationStore,
		generateConversationId
	} from "$lib/stores/conversation";
	import { realtimeStore } from "$lib/stores/realtime";
	import { afterNavigate, goto } from "$app/navigation";
	import { authStore } from "$lib/stores/auth";
	import { v4 as uuidv4 } from "uuid";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { mainContextStore } from "$lib/stores/main-context";
	import AgentChatMessage from "./chat-message/AgentChatMessage.svelte";
	import { chatConversationRoute } from "$lib/routes/routes";
	import { list } from "postcss";

	let chatElement: HTMLDivElement;
	let chatInputElement: HTMLInputElement;
	let isWaitingForAnswer = false;
	let chatInputValue = "";
	let isUserInteractionBlocked = false;

	$: memberId = $authStore.member?.id;

	$: isChatDisabled = isWaitingForAnswer || $isStreaming;

	$: messages = $chatStore.messages;
	$: conversationId = $conversationStore.selectedConversationId;

	const projectId = $mainContextStore.publicProjectConfig?.id;

	if (!projectId) {
		throw new Error("Project id is not defined");
	}

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

		const timestamp = new Date().toISOString();
		const payload = {
			timestamp,
			data: {
				text: chatInputValue,
				conversationId: actualConversationId,
				source: "USER" as "USER" | "AGENT" | "SYSTEM"
			}
		};

		chatElement.scrollTop = chatElement.scrollHeight;

		addMessage({
			id: uuidv4(), // this is a fake id, the real id will be set by the server
			...payload.data,
			createdAt: timestamp,
			format: "PLAIN_TEXT"
		});

		isWaitingForAnswer = true;
		isUserInteractionBlocked = true;
		$conversationStore.selectedConversationId = actualConversationId;

		con.emit("chat-message", payload);

		chatInputValue = "";
	};

	const makeConversation = async () => {
		if (!memberId || !conversationId) {
			return;
		}

		const timestamp = new Date().toISOString();

		addConversation({
			id: conversationId,
			projectId,
			memberId,
			createdAt: timestamp,
			updatedAt: timestamp
		});
		await goto(chatConversationRoute.path(conversationId));
	};

	const listenToStreamChatMessageEnd = (payload: any) => {
		const messageId = payload.data.messageId;

		removeActiveStream(messageId);

		isUserInteractionBlocked = false;
		isWaitingForAnswer = false;

		if (shouldRedirectToConversation) {
			makeConversation();
			shouldRedirectToConversation = false;
		}
	};

	const listenToChatMessage = (payload: any) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(
				`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`
			);

			return;
		}

		if (shouldRedirectToConversation) {
			makeConversation();
			shouldRedirectToConversation = false;
		}

		isWaitingForAnswer = false;
		isUserInteractionBlocked = false;

		addMessage({
			id: payload.data.messageId,
			text: payload.data.text,
			source: payload.data.source,
			createdAt: payload.timestamp,
			format: payload.data.format,
			agentId: payload.data.agentId
		});
	};

	const listenToStreamedChatMessageToken = (payload: any) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(
				`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`
			);

			return;
		}

		const messageId = payload.data.messageId;

		addActiveStream(messageId);

		isWaitingForAnswer = false;

		addStreamedMessageToken({
			id: payload.data.messageId,
			text: payload.data?.text ?? "",
			source: "AGENT",
			createdAt: payload.timestamp,
			format: payload.data.format,
			agentId: payload.data.agentId
		});
	};

	afterNavigate(() => {
		chatInputElement?.focus();
	});

	$: if (chatInputElement) {
		chatInputElement.focus();
	}

	onMount(async () => {
		$realtimeStore.connection?.on("chat-message", listenToChatMessage);
		$realtimeStore.connection?.on(
			"stream-chat-message-start",
			listenToStreamedChatMessageToken
		);
		$realtimeStore.connection?.on(
			"stream-chat-message-token",
			listenToStreamedChatMessageToken
		);
		$realtimeStore.connection?.on("stream-chat-message-end", listenToStreamChatMessageEnd);
	});

	onDestroy(() => {
		$realtimeStore.connection?.off("chat-message", listenToChatMessage);
		$realtimeStore.connection?.off(
			"stream-chat-message-token",
			listenToStreamedChatMessageToken
		);
		$realtimeStore.connection?.off("stream-chat-message-end", listenToStreamChatMessageEnd);
		$realtimeStore.connection?.disconnect();
	});

	let chatElementScrollHeight = 0;
	let chatElementScrollTop = 0;
	let chatElementClientHeight = 0;

	beforeUpdate(() => {
		if (chatElement) {
			chatElementScrollHeight = chatElement.scrollHeight;
			chatElementScrollTop = chatElement.scrollTop;
			chatElementClientHeight = chatElement.clientHeight;
		}
	});

	afterUpdate(() => {
		if (chatElement) {
			// if chat element is scrolled to the bottom, scroll to the bottom again
			if (chatElementScrollHeight - chatElementScrollTop === chatElementClientHeight) {
				chatElement.scrollTop = chatElement.scrollHeight;
			}
		}
	});
</script>

<div class="flex flex-col justify-between relative h-full">
	<div
		bind:this={chatElement}
		class="absolute top-0 bottom-[80px] left-0 right-0 overflow-y-scroll bg-background-primary dark:bg-background-secondary-dark">
		{#if messages?.length > 0}
			<div class="flex flex-col grow gap-4 py-4 px-3 items-start">
				{#each messages as message, index (message.id)}
					<div class="w-full">
						{#if message.agentId}
							<AgentChatMessage
								isLoading={isWaitingForAnswer && messages.length - 1 === index}
								time={dayjs(message.createdAt).format("M/D/YYYY hh:mm A")}
								body={message.text}
								format={message.format}
								agentId={message.agentId} />
						{:else}
							<ChatMessage
								isLoading={isWaitingForAnswer && messages.length - 1 === index}
								from={message.source}
								time={dayjs(message.createdAt).format("M/D/YYYY hh:mm A")}
								body={message.text}
								format={message.format} />
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="mt-32 flex flex-col items-center">
				<div class="flex items-center">
					<h2
						class="text-body-base dark:text-body-base-dark font-semibold text-3xl antialiased">
						AgentLabs
					</h2>
					<div
						class="ml-4 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-body-base dark:text-body-accent-dark rounded-md px-2 py-1 antialiased">
						ALPHA
					</div>
				</div>
				<Spacer size="xs" />
				<div>
					<Typography type="subTitle"
						>Send a message to start interacting with the agent.</Typography>
				</div>
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
						placeholder="Send a message" />
				</div>
				<Button
					submit
					loading={isChatDisabled}
					disabled={isChatDisabled || chatInputValue.length === 0}
					rightIcon={PaperAirplane} />
			</form>
		</div>
	</div>
</div>
