<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { getRedirectResult } from "$lib/utils/oauthUtils";
	import { loginWithOAuthCode } from "$lib/usecases/members/loginWithOAuthCode";
	import { toastError } from "$lib/utils/toast";
	import { homeRoute } from "$lib/routes/routes";
	import { mainContextStore } from "$lib/stores/main-context";

	onMount(async () => {
		const projectId = $mainContextStore.publicProjectConfig?.id;

		if (!projectId) {
			await goto(homeRoute.path());
			return;
		}

		const providerId = $page.params.providerId;

		const { code, state } = await getRedirectResult();

		try {
			await loginWithOAuthCode({
				providerId,
				redirectUri: `${window.location.origin}${window.location.pathname}`,
				state,
				code,
				projectId
			});
			await goto(homeRoute.path());
		} catch (e: any) {
			toastError(e.message ?? "Impossible to login, please try again.");
		}
	});
</script>

<LoadingFrame />
