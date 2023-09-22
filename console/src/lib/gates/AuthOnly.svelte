<script lang="ts">
	import { beforeUpdate, onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore, forgetUser } from "$lib/stores/auth";
	import { projectStore } from "$lib/stores/project";
	import { loginRoute, onboardingRoute, projectOverviewRoute } from "$lib/routes/routes";
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
			// return await goto(projectOverviewRoute.path($projectStore.currentProjectId));
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
