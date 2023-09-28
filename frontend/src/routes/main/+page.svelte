<script lang="ts">
	import "../../app.css";
	import ChatMessage from "$lib/components/chat/chat-message/ChatMessage.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { PaperAirplane } from "svelte-hero-icons";
	import { afterUpdate, onMount } from "svelte";
	import type { AgentInfo } from "../../services/agents.types";
	import ChatInput from "$lib/components/chat/chat-input/ChatInput.svelte";
	import dayjs from "dayjs";
	import type { Message } from "$lib/entities/message/message";

	let defaultBubbles = [
		{
			from: "user",
			title: "Feedback",
			time: "11:00 PM",
			body: "You must stop this now",
			type: undefined
		},
		{
			from: "user",
			title: "Feedback",
			time: "11:00 PM",
			body: "You must stop this now",
			type: undefined
		},
		{
			from: "user",
			title: "Feedback",
			time: "11:00 PM",
			body: "You must stop this now",
			type: undefined
		},
		{
			from: "agent",
			title: "Task Added - Find more relevant articles",
			time: "11:00 PM",
			body: "You must stop this now",
			type: "info"
		},
		{
			from: "agent",
			title: "Thinking - Trying to plan new posts",
			time: "11:00 PM",
			body: "You must stop this now",
			type: "thinking"
		},
		{
			from: "agent",
			title: "Action - Searching on Google",
			time: "11:00 PM",
			body: "Based on the result I found on Google it seems Hacker News is a great source to find new ideas. I am about to post a new artice there.",
			type: "action"
		}
	] as const;

	let selectedAgentInfo: AgentInfo | null = null;

	afterUpdate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});

	let messages: Message[] = [
		{
			text: "Please, write me a demo Linkedin post to demonstrate the power of my AI agent that I have built in 5 minutes using AgentLabs.",
			senderFullName: "John Doe",
			senderId: "1",
			from: "user",
			createdAt: new Date(),
			id: "1",
			seen: false
		},
		{
			text:
				"🚀 Harnessing the Power of AI in Just 5 Minutes! 🚀\n" +
				"\n" +
				"Hey LinkedIn community! 🌍\n" +
				"\n" +
				"Today, I embarked on a challenge to build an AI agent, and guess what? With the help of #PluginLab, I was able to bring it to life in just 5 minutes! 🕐✨\n" +
				"\n" +
				"This isn't just about speed, it's about the democratization of technology. Imagine the potential when anyone, regardless of their tech background, can leverage the power of AI to solve real-world problems, innovate, and drive business growth.\n" +
				"\n",
			senderFullName: "John Doe",
			senderId: "1",
			from: "agent",
			createdAt: new Date(),
			id: "1",
			seen: false
		}
	];

	let inputValue = "";

	const sendMessage = (e: Event) => {
		e.stopPropagation();
		e.preventDefault();

		messages = [
			...messages,
			{
				text: inputValue,
				senderFullName: "John Doe",
				senderId: "1",
				from: "user",
				createdAt: new Date(),
				id: "1",
				seen: false
			}
		];
		inputValue = "";
	};
</script>

<div class="flex flex-col justify-between relative h-full">
	<div
		class="absolute top-0 bottom-[80px] left-0 right-0 overflow-y-scroll bg-background-primary dark:bg-background-secondary-dark">
		{#if messages?.length > 0}
			<div class="flex flex-col grow gap-4 py-4 px-3 items-start">
				{#each messages as message}
					<div class="w-full">
						<ChatMessage
							from={message.from}
							time={dayjs(message.createdAt).format("hh:mm A")}
							body={message.text} />
					</div>
				{/each}
			</div>
		{/if}
		{#if !messages?.length}
			<div class="flex flex-col grow gap-4 py-4 items-start">
				<div class="w-full flex items-center flex-col mt-48 relative">
					<div class="flex items-center">
						<h2
							class="font-semibold text-body-accent dark:text-body-accent-dark text-3xl antialiased">
							AgentLabs
						</h2>
						<div
							class="text-body-subdued dark:text-body-subdued-dark ml-3 font-semibold rounded-md px-2 bg-background-tertiary dark:bg-background-tertiary-dark">
							ALPHA
						</div>
					</div>
					<p class="text-body-subdued dark:text-body-subdued antialiased mt-4">
						Select an agent on your left to get started.
					</p>
				</div>
			</div>
		{/if}
	</div>
	<!-- -->
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
