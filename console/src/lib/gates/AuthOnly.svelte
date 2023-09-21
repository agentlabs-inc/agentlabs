<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore } from "$lib/stores/auth";
	import { loginRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { fetchRequiredUserConfig } from "$lib/usecases/users/fetchRequiredUserConfig";

	let loading = true;

	onMount(async () => {
		if (!$authStore.user) {
			await goto(loginRoute.path());
		}

		console.log("User is logged in", $authStore.user);
		const result = await fetchRequiredUserConfig();
		console.log("Required user config", result);
		loading = false;
	});
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
