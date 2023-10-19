<script lang="ts">
	import { Bars3, ChatBubbleLeft, Icon, Plus } from "svelte-hero-icons";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { fetchConversations } from "$lib/usecases/conversations/fetch-conversations";
	import { authStore } from "$lib/stores/auth";
	import { conversationStore } from "$lib/stores/conversation";
	import Button from "../../button/Button.svelte";
	import { mainContextStore } from "$lib/stores/main-context.js";
	import { agentChatRoute, chatConversationRoute } from "$lib/routes/routes";
	import ProfileMenu from "$lib/components/common/navigation/left-nav/ProfileMenu.svelte";
	import { leftNavStore } from "$lib/stores/left-nav";
	import { watchResize } from "svelte-watch-resize";

	onMount(async () => {
		const member = $authStore.member;
		const projectId = $mainContextStore.publicProjectConfig?.id;

		if (!member || !projectId) {
			return;
		}

		await fetchConversations(projectId);
	});

	const handleNewChat = () => {
		goto(agentChatRoute.path()).then(() => {
			$conversationStore.selectedConversationId = null;
		});
	};

	const handleConversationClick = async (conversationId: string) => {
		await goto(chatConversationRoute.path(conversationId));
	};

	$: conversations = $conversationStore.list;
	$: selectedConversationId = $conversationStore.selectedConversationId;

	$: widthClass = $leftNavStore.isOpened ? "w-[250px]" : "w-[0px]";

	const handleResize = (node: HTMLElement) => {
		if (node.clientWidth < 768) {
			$leftNavStore.close();
		}
	};
</script>

<svelte:body use:watchResize={handleResize} />

<div
	class="{widthClass} transition-all sticky flex flex-col h-[calc(100dvh)] top-0 overflow-y-hidden {$leftNavStore.isOpened
		? 'border-r'
		: ''} border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-primary-dark">
	<div
		class="g-background-secondary dark:bg-background-primary-dark h-[60px] p-3 flex gap-3 items-center justify-between flex-shrink-0 border-b border-stroke-base dark:border-stroke-base-dark">
		<Button fullWidth leftIcon={Plus} type="primary" on:click={handleNewChat} size="smaller"
			>New chat</Button>
		<Button
			fullHeight
			leftIcon={Bars3}
			type="none"
			size="smaller"
			on:click={$leftNavStore.toggle} />
	</div>
	<section class="py-5 px-3 overflow-x-scroll flex-grow">
		<div class="flex flex-col gap-3 antialiased">
			{#each conversations as conversation}
				<button
					on:click={() => handleConversationClick(conversation.id)}
					class="text-ellipsis overflow-ellipsis flex gap-2 items-center justify-start hover:bg-background-accent dark:hover:bg-background-accent-dark text-sm text-body-base dark:text-body-base-dark py-3 px-2 rounded-lg cursor-pointer"
					class:dark:bg-background-accent-dark={conversation.id ===
						selectedConversationId}
					class:bg-background-accent={conversation.id === selectedConversationId}>
					<Icon src={ChatBubbleLeft} class="w-4 flex-shrink-0" />
					<span class="block h-5 truncate grow-0">conversation #{conversation.id}</span>
				</button>
			{/each}
		</div>
	</section>
	<div class="shrink-0 w-full border-t border-stroke-base dark:border-stroke-base-dark">
		<ProfileMenu />
	</div>
</div>
