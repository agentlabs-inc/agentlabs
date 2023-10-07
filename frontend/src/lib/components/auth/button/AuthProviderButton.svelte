<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import type { AuthProvider } from "$lib/components/auth/types";
	import { AuthProviderNameMap } from "$lib/components/auth/types";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";
	import type { PublicAuthMethodDto } from "$lib/services/gen-api";
	import { signInWithRedirect } from "$lib/services/oauth/signInWithRedirect";
	import GoogleAuthProvider from "$lib/services/oauth/providers/google";

	export let provider: AuthProvider;

	export let authMethod: PublicAuthMethodDto;

	let providerCurrentlyLoading: AuthProvider | null = null;

	const providerIconMap: Record<
		AuthProvider,
		typeof GoogleIcon | typeof GitlabIcon | typeof GithubIcon
	> = {
		GOOGLE: GoogleIcon,
		GITLAB: GitlabIcon,
		GITHUB: GithubIcon
	};

	const redirectUri = `http://${window.location.origin.split(".", 2)[1]}/oauth/handler/${
		authMethod.provider
	}`.toLowerCase();

	console.log(authMethod);

	const providerHandlerMap: Record<AuthProvider, () => void> = {
		GOOGLE: () => {
			alert(redirectUri);
			signInWithRedirect(
				new GoogleAuthProvider({
					clientId: authMethod.clientId,
					scopes: authMethod.scopes
				}),
				redirectUri
			);
		}
	};

	const handleLogin = () => {
		providerCurrentlyLoading = provider;

		providerHandlerMap[provider]();
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
