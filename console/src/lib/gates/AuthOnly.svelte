<script lang="ts">
	import { beforeUpdate, onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore, forgetUser } from "$lib/stores/auth";
	import { loginRoute, onboardingRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { fetchRequiredUserConfig } from "$lib/usecases/users/fetchRequiredUserConfig";

	let loading = true;

	onMount(async () => {
		if (!$authStore.user) {
			console.log("Not logged in.");
			return await goto(loginRoute.path());
		}

		try {
			const { projectCount } = await fetchRequiredUserConfig();
			if (projectCount === 0) {
				return await goto(onboardingRoute.path());
			}
		} catch (e: any) {
			if (e.status === 401) {
				forgetUser();
				await goto(loginRoute.path());
			} else {
				console.error(e);
			}
		} finally {
			loading = false;
		}
	});
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
