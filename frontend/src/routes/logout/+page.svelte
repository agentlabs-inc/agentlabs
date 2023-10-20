<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { forgetMember } from "$lib/stores/auth";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";
	import { onMount } from "svelte";
	import { agentChatRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";

	onMount(() => {
		forgetMember();
		goto(agentChatRoute.path());
	});
</script>

<AuthOnly>
	<LoadingFrame />
</AuthOnly>
