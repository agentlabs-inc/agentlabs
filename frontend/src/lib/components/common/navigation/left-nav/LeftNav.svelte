<script lang="ts">
	import { ChatBubbleLeft, Icon, User, UserGroup } from "svelte-hero-icons";
	import SidebarHeader from "$lib/components/sidebar/header/SidebarHeader.svelte";
	import { goto } from "$app/navigation";

	$: items = [
		{
			label: "How to use the dashboard the right way",
			icon: User,
			path: ""
		},
		{
			label: "How to use AgentLabs?",
			icon: User,
			path: ""
		}
	];
</script>

<div
	class="sticky top-0 min-h-full border-r border-stroke-base dark:border-stroke-base-dark w-[250px] bg-background-secondary dark:bg-background-primary-dark">
	<section>
		<SidebarHeader>Conversations</SidebarHeader>
	</section>
	<section class="py-5 px-3">
		<div class="flex flex-col gap-3 antialiased">
			{#each items as item}
				<div
					on:keydown={() => {}}
					on:click={() => goto(item.path)}
					class="text-ellipsis overflow-ellipsis flex gap-2 items-center justify-start hover:bg-background-accent dark:hover:bg-background-accent-dark text-sm text-body-base dark:text-body-base-dark py-3 px-2 rounded-lg cursor-pointer">
					<Icon src={ChatBubbleLeft} class="w-4 flex-shrink-0" />
					<span class="block h-5 truncate grow-0">{item.label}</span>
				</div>
			{/each}
		</div>
	</section>
</div>
