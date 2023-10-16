<script lang="ts">
	import { env } from "$env/dynamic/public";
	import Intercom from "$lib/components/common/intercom/Intercom.svelte";
	import { authStore } from "$lib/stores/auth";
	import { validateEnv } from "$lib/utils/validateEnv";

	/**
	 This component injects the Intercom snippet if an INTERCOM_APP_ID was provided.
	 */

	const safeEnv = validateEnv(env);
	const user = $authStore.user;

	if (!user) {
		throw new Error("IntercomContext should be used before the user is set");
	}

	if (!safeEnv) {
		throw new Error("Failed to validate env");
	}

	const intercomAppId = safeEnv.PUBLIC_INTERCOM_APP_ID;

</script>

{#if intercomAppId}
	<Intercom 
		config={{
			appId: intercomAppId,
			name: user.fullName,
			email: user.email,
			userId: user.id,
			createdAt: new Date(user.createdAt).getTime()
		}}
	/>
{/if}
<slot />
