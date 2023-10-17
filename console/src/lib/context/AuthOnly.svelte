<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore, forgetUser } from "$lib/stores/auth";
	import {
		loginRoute,
		onboardingRoute,
		projectOnboardingAuthMethodRoute
	} from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { fetchRequiredUserConfig } from "$lib/usecases/users/fetchRequiredUserConfig";
	import IntercomContext from "./IntercomContext.svelte";
	import Device from "svelte-device-info";
	import { browser } from "$app/environment";
	import NotFound from "$lib/assets/img/illustrations/not-found.svg";
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";

	let loading = true;

	onMount(async () => {
		if (!$authStore.user) {
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

	$: isEnabledDevice = browser && !(Device.isPhone || Device.isTablet);
</script>

{#if !loading}
	<IntercomContext>
		{#if isEnabledDevice}
			<slot />
		{:else}
			<div
				class="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
				<div class="max-w-5xl">
					<Card>
						<div class="flex flex-col items-center justify-center gap-3 py-5 px-10">
							<Typography type="mainTitle">Unsupported device</Typography>
							<Typography type="subTitle"
								>We only allow Desktop experience at the moment.</Typography>
							<img src={NotFound} alt="not found" class="w-43" />
						</div>
					</Card>
				</div>
			</div>
		{/if}
	</IntercomContext>
{:else}
	<LoadingFrame />
{/if}
