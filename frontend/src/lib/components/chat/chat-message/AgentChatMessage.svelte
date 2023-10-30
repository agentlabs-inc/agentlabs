<script lang="ts">
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import { getAgentById } from "$lib/stores/agent";
	import type { ChatMessageFormat } from "$lib/stores/chat";
	import TypingLoader from "$lib/components/chat/chat-message/TypingLoader.svelte";
	import type { MessageAttachmentWrapper } from "$lib/entities/message/message";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import Attachment from "./Attachment.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";

	export let time: string;
	export let body: string;
	export let format: ChatMessageFormat;
	export let attachments: MessageAttachmentWrapper[] = [];

	export let isLoading = true;
	export let agentId: string;

	let bubbleClass: string;

	$: bubbleClass = "bg-background-secondary dark:bg-[#282833]";

	const agent = getAgentById(agentId);

	$: letter = agent ? agent.name[0] + agent.name[1] : "?";

	if (!agent) {
		throw new Error("Agent not found");
	}

	$: imageAttachements = attachments.filter((messageAttachment: MessageAttachmentWrapper) =>
		messageAttachment.attachment.mimeType.startsWith("image/")
	);

	$: otherAttachments = attachments.filter(
		(messageAttachment: MessageAttachmentWrapper) =>
			!messageAttachment.attachment.mimeType.startsWith("image/")
	);
</script>

<div class="{bubbleClass} {isLoading ? 'animate-pulse' : ''} rounded-md py-5 px-5 antialiased">
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0" title={agent.name}>
				<LetterAvatar>{letter}</LetterAvatar>
			</div>

			<div>
				<div class="flex flex-col flex-grow relative overflow-x-auto">
					<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
						{time} - {agent.name}
					</div>
					<div
						class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7 w-full">
						{#if !body?.length}<TypingLoader />{/if}
						{#if format === "MARKDOWN"}
							<MarkdownRenderer source={body} />
						{:else}
							{body}
						{/if}
					</div>
				</div>
				<Spacer />
				<div class="flex items-center gap-4 flex-wrap">
					{#each imageAttachements as attachment}
						<Attachment
							name={attachment.attachment.name}
							sizeBytes={attachment.attachment.sizeBytes}
							mimeType={attachment.attachment.mimeType}
							id={attachment.attachment.id} />
					{/each}
				</div>
				<Spacer />
				<div class="flex items-center gap-4 flex-wrap">
					{#each otherAttachments as attachment}
						<Attachment
							name={attachment.attachment.name}
							sizeBytes={attachment.attachment.sizeBytes}
							mimeType={attachment.attachment.mimeType}
							id={attachment.attachment.id} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
