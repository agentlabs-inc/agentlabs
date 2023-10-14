<script lang="ts">
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import { agentStore, getAgentById } from "$lib/stores/agent";
	import { authStore } from "$lib/stores/auth";
	import type { ChatMessageFormat } from "$lib/stores/chat";

	export let time: string;
	export let body: string;
	export let format: ChatMessageFormat;

	export let isLoading = true;
	export let agentId: string;

	let bubbleClass: string;

	$: bubbleClass = "bg-background-secondary dark:bg-[#282833]";

	const agent = getAgentById(agentId);

	console.log($agentStore.list)

	$: letter = agent ? agent.name[0] + agent.name[1] : '?'

	console.log(agentId, agent)

	if (!agent) {
		throw new Error("Agent not found");
	}
</script>

<div class="{bubbleClass} {isLoading ? 'animate-pulse' : ''} rounded-md py-5 px-5 antialiased">
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
					{#if format === "MARKDOWN"}
						<MarkdownRenderer source={body} />
					{:else}
						{body}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
