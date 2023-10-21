<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getRedirectResult } from "$lib/utils/oauthUtils";
	import { parseDemoRedirectState } from "$lib/services/oauth/demoRedirectState";

	onMount(async () => {
		const { code, state } = await getRedirectResult();

		const parsedState = parseDemoRedirectState(state);

		try {
			if (parsedState.initialOrigin !== window.location.origin) {
				return await goto(
					window.location.href.replace(window.location.origin, parsedState.initialOrigin),
					{ replaceState: true }
				);
			}

			window.opener.postMessage(
				{
					redirectUri: parsedState.redirectUri,
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
