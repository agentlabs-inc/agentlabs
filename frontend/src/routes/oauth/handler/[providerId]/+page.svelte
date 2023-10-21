<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getRedirectResult } from "$lib/utils/oauthUtils";
	import { homeRoute } from "$lib/routes/routes";
	import { mainContextStore } from "$lib/stores/main-context";

	onMount(async () => {
		const projectId = $mainContextStore.publicProjectConfig?.id;

		if (!projectId) {
			await goto(homeRoute.path());
			return;
		}

		try {
			const { code, state } = await getRedirectResult();

			window.opener.postMessage(
				{
					redirectUri: null,
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
