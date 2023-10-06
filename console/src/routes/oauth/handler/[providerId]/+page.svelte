<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { loginWithOAuthCode } from "$lib/usecases/users/loginWithOAuthCode";
	import { page } from "$app/stores";
	import { getRedirectResult } from "$lib/utils/oauthUtils";
	import { toastError } from "$lib/utils/toast";
	import { goto } from "$app/navigation";
	import { homeRoute, loginRoute } from "$lib/routes/routes";

	onMount(async () => {
		const providerId = $page.params.providerId;

		const { code, state } = await getRedirectResult();

		try {
			await loginWithOAuthCode({
				providerId,
				redirectUri: `${window.location.origin}${window.location.pathname}`,
				state,
				code
			});
			await goto(homeRoute.path());
		} catch (e: any) {
			toastError(e.message ?? "Impossible to login, please try again.");
			await goto(loginRoute.path());
		}
	});
</script>

<LoadingFrame />
