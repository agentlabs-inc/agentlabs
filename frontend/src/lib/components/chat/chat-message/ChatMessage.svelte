<script lang="ts">
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import AgentIcon from "$lib/assets/img/agent-icon.svg";
	import { authStore } from "$lib/stores/auth";

	export let time: string;
	export let body: string;
	export let from: "USER" | "AGENT" | "SYSTEM";

	let bubbleClass: string;

	$: bubbleClass =
		from === "USER"
			? "bg-background-primary dark:bg-background-primary-dark"
			: "bg-background-secondary dark:bg-[#282833]";

	const member = $authStore.member;
</script>

<div class={`${bubbleClass} rounded-md py-5 px-5 antialiased`}>
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0">
				{#if from === "USER"}
					<Avatar alt="user avatar" src={member?.profilePictureUrl ?? ''} />
				{:else if from === "AGENT"}
					<LetterAvatar>Ag</LetterAvatar>
				{:else}
					<Avatar alt="user avatar" src={AgentIcon} />
				{/if}
			</div>

			<div>
				<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
					{time}
				</div>
				<div class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7">
					{#if from !== "USER"}
						<MarkdownRenderer source={body} />
					{:else}
						{body}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
