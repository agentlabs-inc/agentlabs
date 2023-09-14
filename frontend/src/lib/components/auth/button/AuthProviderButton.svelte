<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import type { AuthProvider } from "$lib/components/auth/types";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";
	import { AgentLabsApp } from "$lib/externals/agentlabs-js-sdk/agentlabs";
	import { getAuth, signInWithRedirect } from "$lib/externals/agentlabs-js-sdk/auth";
	import GoogleAuthProvider from "$lib/externals/agentlabs-js-sdk/auth-providers/google";
	import GitlabAuthProvider from "$lib/externals/agentlabs-js-sdk/auth-providers/gitlab";
	import GithubAuthProvider from "$lib/externals/agentlabs-js-sdk/auth-providers/github";

	export let provider: AuthProvider;

	let providerCurrentlyLoading: AuthProvider | null = null;

	const providerIconMap: Record<
		AuthProvider,
		typeof GoogleIcon | typeof GitlabIcon | typeof GithubIcon
	> = {
		google: GoogleIcon,
		gitlab: GitlabIcon,
		github: GithubIcon
	};

	const providerNameMap: Record<AuthProvider, string> = {
		google: "Google",
		gitlab: "Gitlab",
		github: "Github"
	};

	// This will be instantiated in the main layout after fetching project config
	const app = new AgentLabsApp({
		project: {
			id: "",
			slug: "something",
			name: "something"
		},
		signInMethods: {
			google: {
				id: "google",
				isEnabled: true,
				oauthSettings: {
					clientId:
						"1046622402922-2q425h1v1dmacgg2p4g0bj89f8un67q3.apps.googleusercontent.com"
				}
			}
		}
	});

	const auth = getAuth(app);

	const providerHandlerMap: Record<AuthProvider, () => void> = {
		google: () =>
			signInWithRedirect(
				auth,
				new GoogleAuthProvider([], auth.getOAuthSignInMethods().google)
			),
		gitlab: () =>
			signInWithRedirect(
				auth,
				new GitlabAuthProvider([], auth.getOAuthSignInMethods().gitlab)
			),
		github: () =>
			signInWithRedirect(
				auth,
				new GithubAuthProvider([], auth.getOAuthSignInMethods().github)
			)
	};

	const handleLogin = () => {
		console.log(auth.getOAuthSignInMethods().google);

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
		<span>Continue with {providerNameMap[provider]}</span>
	</div>
</Button>
