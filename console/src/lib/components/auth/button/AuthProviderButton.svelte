<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import type { AuthProvider } from "$lib/components/auth/types";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";

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

	const handleLogin = () => {};
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
