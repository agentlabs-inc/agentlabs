<script lang="ts">
import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
import { authStore } from "$lib/stores/auth";
import { agentStore } from "$lib/stores/agent";
import { mainContextStore } from "$lib/stores/main-context";
import { openRealtimeConnection } from "$lib/stores/realtime";
import { onMount } from "svelte";

let isLoading = true;

onMount(async () => {
	const agent = $agentStore.selectedAgent;
	const project = $mainContextStore.publicProjectConfig;
	const member = $authStore.member;

	if (!agent || !project || !member) {
		return;
	}

	try {
		await openRealtimeConnection(project.id, agent.id, member.id);
		isLoading = false;
	} catch (e) {
		console.error(e);
	}
});
</script>

{#if isLoading}
	<LoadingFrame />
{:else}
	<slot />
{/if}
