<script lang="ts">
	import "../../app.css";
	import ChatMessage from "$lib/components/chat/chat-message/ChatMessage.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { PaperAirplane } from "svelte-hero-icons";
	import { afterUpdate, onDestroy, onMount } from "svelte";
	import ChatInput from "$lib/components/chat/chat-input/ChatInput.svelte";
	import dayjs from "dayjs";
	import type { Message } from "$lib/entities/message/message";
	import { realtimeStore } from "$lib/stores/realtime";
	import { goto } from "$app/navigation";

	afterUpdate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});

	let messages: Message[] = [];

	let inputValue = "";

	const sendMessage = (e: Event) => {
		e.stopPropagation();
		e.preventDefault();

		const con = $realtimeStore.connection;

		if (!con) {
			return;
		}

		con.emit(
			"chat-message",
			{
				data: {
					text: inputValue
				}
			},
			(ack: any) => {
				if (!ack.error) {
					const conversationId = ack.data.conversationId;
					goto(`/main/c/${conversationId}`);
				}
			}
		)

		inputValue = "";
	};
</script>

<div class="flex flex-col justify-between relative h-full">
	<div
		class="absolute top-0 bottom-[80px] left-0 right-0 overflow-y-scroll bg-background-primary dark:bg-background-secondary-dark">
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
						Send a message to start the conversation
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
