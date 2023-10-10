<script lang="ts">
	import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { agentStore } from "$lib/stores/agent";
	import type { AgentStore } from "$lib/stores/agent";
	import { goto } from "$app/navigation";
	import { selectAgentRoute } from "$lib/routes/routes";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";

	let loading = true;

	onMount(async () => {
		const { list, selectedAgent } = get<AgentStore>(agentStore);


		if (list.length > 0 && !!selectedAgent) {
			loading = false;
			return;
		}

		await goto(selectAgentRoute.path());
	});
</script>

{#if loading}
	<LoadingFrame />
{:else}
	<slot />
{/if}
