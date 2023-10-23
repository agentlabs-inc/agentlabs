<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import type { AuthProvider } from "$lib/components/auth/types";
	import { AuthProviderNameMap } from "$lib/components/auth/types";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";
	import type { PublicAuthMethodDto } from "$lib/services/gen-api";
	import {
		initSignInWithPopup,
		initSignInWithRedirect
	} from "$lib/usecases/members/initSignInWithRedirect";
	import { mainContextStore } from "$lib/stores/main-context";

	export let provider: AuthProvider;

	export let authMethod: PublicAuthMethodDto;

	const publicProjectConfig = $mainContextStore?.publicProjectConfig;

	if (!publicProjectConfig) {
		throw new Error("publicProjectConfig is not defined");
	}

	let providerCurrentlyLoading: AuthProvider | null = null;

	const providerIconMap: Record<
		AuthProvider,
		typeof GoogleIcon | typeof GitlabIcon | typeof GithubIcon | null
	> = {
		GOOGLE: GoogleIcon,
		GITLAB: GitlabIcon,
		GITHUB: GithubIcon,
		MICROSOFT: null,
		PASSWORDLESS_EMAIL: null,
		EMAIL_AND_PASSWORD: null,
		ANONYMOUS: null,
		SMS: null
	};

	const handleLogin = () => {
		providerCurrentlyLoading = provider;

		initSignInWithPopup(authMethod, publicProjectConfig.id);

		// initSignInWithRedirect(authMethod, publicProjectConfig.id);
	};
</script>

<Button
	type="secondary"
	center={false}
	on:click={handleLogin}
	disabled={providerCurrentlyLoading === provider}>
	<div class="flex items-center gap-5">
		<svelte:component this={providerIconMap[provider]} />
		<span>Continue with {AuthProviderNameMap[provider]}</span>
	</div>
</Button>
