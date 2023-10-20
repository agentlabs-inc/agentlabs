<script lang="ts">
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import { agentStore, getAgentById } from "$lib/stores/agent";
	import { authStore } from "$lib/stores/auth";
	import type { ChatMessageFormat } from "$lib/stores/chat";
	import TypingLoader from "$lib/components/chat/chat-message/TypingLoader.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import MessageInput from "$lib/components/chat/chat-message/MessageInput.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { PaperAirplane } from "svelte-hero-icons";

	export let time: string;
	export let agentId: string;

	let bubbleClass: string;

	$: bubbleClass = "bg-background-secondary dark:bg-[#282833]";

	const agent = getAgentById(agentId);

	$: letter = agent ? agent.name[0] + agent.name[1] : "?";

	if (!agent) {
		throw new Error("Agent not found");
	}
</script>

<div class="{bubbleClass} rounded-md py-5 px-5 antialiased">
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0" title={agent.name}>
				<LetterAvatar>{letter}</LetterAvatar>
			</div>

			<div class="flex flex-col flex-grow relative overflow-x-scroll">
				<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
					{time} - {agent.name}
				</div>
				<div
					class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7 w-full">
					To go further and proceed we'll your email address.
				</div>
				<div
					class="mt-3 max-w-[400px] bg-background-primary border border-stroke-base dark:bg-background-primary-dark dark:border-stroke-base-dark rounded-lg p-4">
					<MessageInput
						name="email"
						type="email"
						placeholder="Please enter your email"
						value="" />
				</div>
			</div>
		</div>
	</div>
</div>
