<script lang="ts">
import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
import { authStore } from "$lib/stores/auth";
import { mainContextStore } from "$lib/stores/main-context";
import { openRealtimeConnection } from "$lib/stores/realtime";
import { onMount } from "svelte";

let isLoading = true;

onMount(async () => {
	const project = $mainContextStore.publicProjectConfig;
	const member = $authStore.member;
	const accessToken = $authStore.accessToken;

	if (!project || !member || !accessToken) {
		return;
	}

	try {
		await openRealtimeConnection(project.id, accessToken);
		isLoading = false
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
