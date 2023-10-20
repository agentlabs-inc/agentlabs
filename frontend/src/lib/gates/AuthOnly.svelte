<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore } from "$lib/stores/auth";
	import { signInAnonymously } from "$lib/usecases/members/signInAnonymously";
	import { mainContextStore } from "$lib/stores/main-context";

	let loading = true;

	onMount(async () => {
		if (!$authStore.member) {
			await signInAnonymously($mainContextStore.publicProjectConfig?.id);
			loading = false;
		}
		loading = false;
	});
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
