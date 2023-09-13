<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import type { AuthProvider } from "$lib/components/auth/types";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";

	export let provider: AuthProvider;

	const providerIconMap = {
		google: GoogleIcon,
		gitlab: GitlabIcon,
		github: GithubIcon
	};
</script>

<Button type="secondary" center={false}>
	<div class="flex items-center gap-5">
		<svelte:component this={providerIconMap[provider]} />
		<span>Continue with Google</span>
	</div>
</Button>
