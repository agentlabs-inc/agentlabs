<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getRedirectResult } from "$lib/utils/oauthUtils";
	import { homeRoute } from "$lib/routes/routes";
	import { mainContextStore } from "$lib/stores/main-context";
	import { page } from "$app/stores";

	onMount(async () => {
		const projectId = $mainContextStore.publicProjectConfig?.id;

		if (!projectId) {
			await goto(homeRoute.path());
			return;
		}

		try {
			const { code, state } = await getRedirectResult();

			let redirectUri =
				`${window.location.protocol}//${window.location.host}/oauth/handler/${$page.params.providerId}`.toLowerCase();

			window.opener.postMessage(
				{
					redirectUri,
					code,
					state,
					messageType: "OAuthRedirectResult"
				},
				"*"
			);
		} catch {
			window.opener.postMessage(
				{
					messageType: "OAuthErrorResult"
				},
				"*"
			);
		}
	});
</script>

<LoadingFrame />
