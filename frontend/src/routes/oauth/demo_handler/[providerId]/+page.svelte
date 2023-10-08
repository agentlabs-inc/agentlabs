<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { getRedirectResult } from "$lib/utils/oauthUtils";
	import { parseDemoRedirectState } from "$lib/services/oauth/demoRedirectState";
	import { loginWithOAuthCode } from "$lib/usecases/members/loginWithOAuthCode";
	import { toastError } from "$lib/utils/toast";
	import { homeRoute } from "$lib/routes/routes";

	onMount(async () => {
		const providerId = $page.params.providerId;

		const { code, state } = await getRedirectResult();

		const parsedState = parseDemoRedirectState(state);

		try {
			if (parsedState.initialOrigin !== window.location.origin) {
				return await goto(
					window.location.href.replace(window.location.origin, parsedState.initialOrigin),
					{ replaceState: true }
				);
			}

			await loginWithOAuthCode({
				providerId,
				redirectUri: parsedState.redirectUri,
				state,
				code,
				projectId: parsedState.projectId
			});
			await goto(homeRoute.path());
		} catch (e: any) {
			toastError(e.message ?? "Impossible to login, please try again.");
		}
	});
</script>

<LoadingFrame />
