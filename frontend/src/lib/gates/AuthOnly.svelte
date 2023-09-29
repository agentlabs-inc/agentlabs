<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore } from "$lib/stores/auth";
	import { loginRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";

	let loading = true;

	onMount(async () => {
		if (!$authStore.member) {
			return await goto(loginRoute.path());
		}
		loading = false;
	});
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
