<script lang="ts">
	import { onMount } from "svelte";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { authStore } from "$lib/stores/auth";
	import { signInAnonymously } from "$lib/usecases/members/signInAnonymously";
	import { mainContextStore } from "$lib/stores/main-context";
	import { verifyMemberOrLogout } from "$lib/usecases/members/verifyMemberOrLogout";

	let loading = true;

	onMount(async () => {
		if (!$authStore.member) {
			if (!$mainContextStore.publicProjectConfig?.id)
				throw new Error("No public project config");

			await signInAnonymously($mainContextStore.publicProjectConfig?.id);
			loading = false;
		}

		await verifyMemberOrLogout();

		loading = false;
	});
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
