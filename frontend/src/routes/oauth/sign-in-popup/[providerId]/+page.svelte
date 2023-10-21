<script lang="ts">
	import type { AuthProvider } from "$lib/components/auth/types";
	import type { PublicAuthMethodDto } from "$lib/services/gen-api";

	import { initSignInWithRedirect } from "$lib/usecases/members/initSignInWithRedirect";
	import { mainContextStore } from "$lib/stores/main-context";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	const provider = $page.params.providerId as AuthProvider;

	let authMethod: PublicAuthMethodDto;

	const publicProjectConfig = $mainContextStore?.publicProjectConfig;

	if (!publicProjectConfig) {
		throw new Error("publicProjectConfig is not defined");
	}

	onMount(() => {
		const authMethod_ = publicProjectConfig.authMethods.find((m) => m.provider === provider);

		if (!authMethod_) {
			throw new Error(`authMethod for provider ${provider} not found`);
		}

		authMethod = authMethod_;

		initSignInWithRedirect(authMethod, publicProjectConfig.id);
	});
</script>
