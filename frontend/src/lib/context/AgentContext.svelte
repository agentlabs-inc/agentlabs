<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { fetchAgents } from "$lib/usecases/agents/fetch-agents";
	import { mainContextStore } from "$lib/stores/main-context";

	let loading = true;

	onMount(async () => {
		const projectId = $mainContextStore.publicProjectConfig?.id;

		if (!projectId) {
			throw new Error("Project ID not found");
		}

		await fetchAgents(projectId);

		loading = false;
	});
</script>

{#if loading}
	<LoadingFrame />
{:else}
	<slot />
{/if}
