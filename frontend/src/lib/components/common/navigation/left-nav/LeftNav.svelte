<script lang="ts">
	import { ChatBubbleLeft, Icon } from "svelte-hero-icons";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { fetchConversations } from "$lib/usecases/conversations/fetch-conversations";
	import { agentStore } from "$lib/stores/agent";
	import { authStore } from "$lib/stores/auth";
	import { conversationStore } from "$lib/stores/conversation";
	import Button from "../../button/Button.svelte";
	
	onMount(async () => {
		const agent = $agentStore.selectedAgent;
		const member = $authStore.member;

		if (!agent || !member) {
			return;
		}

		await fetchConversations(agent.id);
	});


	const handleNewChat = () => {
		goto('/main').then(() => {
			$conversationStore.selectedConversationId = null;
		})
	}

	const handleConversationClick = async (conversationId: string) => {
		await goto(`/main/c/${conversationId}`);
	}

	$: conversations = $conversationStore.list;
	$: selectedConversationId = $conversationStore.selectedConversationId;
</script>

<div
	class="sticky top-0 h-[calc(100vh-60px)] overflow-y-auto border-r border-stroke-base dark:border-stroke-base-dark w-[250px] bg-background-secondary dark:bg-background-primary-dark">
	<section class="py-5 px-3">
		<div class="flex flex-col gap-3 antialiased">
			<Button type='primary' on:click={handleNewChat}>
			New chat
			</Button>
			{#each conversations as conversation}
				<button
					on:click={() => handleConversationClick(conversation.id)}
					class="text-ellipsis overflow-ellipsis flex gap-2 items-center justify-start hover:bg-background-accent dark:hover:bg-background-accent-dark text-sm text-body-base dark:text-body-base-dark py-3 px-2 rounded-lg cursor-pointer"
					class:dark:bg-background-accent-dark={conversation.id === selectedConversationId}
					class:bg-background-accent={conversation.id === selectedConversationId}
					>

					<Icon src={ChatBubbleLeft} class="w-4 flex-shrink-0" />
					<span class="block h-5 truncate grow-0">conversation #{conversation.id}</span>
				</button>
			{/each}
		</div>
	</section>
</div>
