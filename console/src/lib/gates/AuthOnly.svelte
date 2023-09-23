<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore, forgetUser } from "$lib/stores/auth";
	import {
		loginRoute,
		onboardingRoute,
		projectOnboardingAuthMethodRoute,
		projectOnboardingUseApplicationRoute,
		projectOverviewRoute
	} from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { fetchRequiredUserConfig } from "$lib/usecases/users/fetchRequiredUserConfig";

	let loading = true;

	onMount(async () => {
		if (!$authStore.user) {
			console.log("Not logged in.");
			return await goto(loginRoute.path());
		}

		try {
			const { onboarding } = await fetchRequiredUserConfig();

			if (!onboarding?.projectId) {
				return await goto(onboardingRoute.path());
			}

			if (!onboarding?.hasAddedAuthMethod) {
				return await goto(projectOnboardingAuthMethodRoute.path(onboarding.projectId));
			}

			if (!onboarding?.hasUsedTheApplication) {
				return await goto(projectOnboardingUseApplicationRoute.path(onboarding.projectId));
			}

			// return await goto(projectOverviewRoute.path(onboarding.projectId));
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
