<script lang="ts">
	import ThemeSwitch from "$lib/components/common/theme-switch/ThemeSwitch.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { agentStore, setSelectedAgent } from "$lib/stores/agent";
	import type { Agent } from "$lib/entities/agent/agent";
	import { fetchAgents } from "$lib/usecases/agents/fetch-agents";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { agentChatRoute } from "$lib/routes/routes";
	import { getMainContextStore } from "$lib/stores/main-context";

	const projectConfig = getMainContextStore().publicProjectConfig;

	if (!projectConfig) {
		throw new Error("Project config not found");
	}

	const onAgentSelected = (agent: Agent) => {
		setSelectedAgent(agent);
		goto(agentChatRoute.path());
	};

	let loading = false;
	onMount(async () => {
		loading = true;
		await fetchAgents(projectConfig.id);
		loading = false;
	});

	$: agents = $agentStore.list;
</script>

<div class="flex h-screen items-center justify-center">
	<div class="fixed left-3">
		<ThemeSwitch />
	</div>
	<div class="max-w-5xl flex flex-col gap-3">
		{#if loading}
			<div
				class="flex-grow m-auto bg-background-accent dark:bg-background-tertiary-dark dark:text-body-accent-dark w-32 h-4 rounded-md animate-pulse" />
		{:else}
			<div class="flex-grow text-center text-2xl text-body-accent dark:text-body-accent-dark">
				Select your agent
			</div>
		{/if}
		<Spacer size="xs" />
		<div class="flex gap-5 items-center justify-center">
			{#if loading}
				<div
					class="flex flex-col items-center justify-center gap-2 opacity-10 animate-pulse">
					<div
						class="rounded-md w-32 h-32 items-center justify-center flex bg-gradient-to-b from-[#0C73E7] to-[#4E99EE] border-2 dark:hover:border-white border-[#0C73E7] hover:border-blue-900 cursor-pointer text-white dark:text-white text-5xl" />
					<div
						class="bg-background-tertiary dark:bg-background-tertiary-dark w-10 h-4 animate-pulse rounded-md" />
				</div>
				<div
					class="flex flex-col items-center justify-center gap-2 opacity-5 animate-pulse">
					<div
						class="rounded-md w-32 h-32 items-center justify-center flex bg-gradient-to-b from-[#0C73E7] to-[#4E99EE] border-2 dark:hover:border-white border-[#0C73E7] hover:border-blue-900 cursor-pointer text-white dark:text-white text-5xl" />
					<div
						class="bg-background-tertiary dark:bg-background-tertiary-dark w-10 h-4 animate-pulse rounded-md" />
				</div>
			{:else}
				{#each agents as agent}
					<div class="flex flex-col items-center justify-center gap-2">
						<button
							on:click={() => onAgentSelected(agent)}
							class="rounded-md w-32 h-32 items-center justify-center flex bg-gradient-to-b from-[#0C73E7] to-[#4E99EE] border-2 dark:hover:border-white border-[#0C73E7] hover:border-blue-900 cursor-pointer text-white dark:text-white text-5xl">
							{agent.name[0].toUpperCase()}
						</button>
						<span class="text-body-base dark:text-body-base-dark antialiased text-sm"
							>{agent.name}</span>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
