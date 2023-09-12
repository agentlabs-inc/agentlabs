<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import type { AuthProvider } from "$lib/components/auth/button/types";
	import google from "$lib/assets/img/google-icon.svg";

	export let provider: AuthProvider;
</script>

<Button type="secondary">
	<img src={google} alt={"google"} class="w-5" />
	<span>Continue with Google</span>
</Button>
