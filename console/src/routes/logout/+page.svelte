<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { forgetUser } from "$lib/stores/auth";
	import AuthOnly from "$lib/context/AuthOnly.svelte";
	import { onMount } from "svelte";
	import { telemetryService } from "$lib/services/telemetry";

	onMount(() => {
		telemetryService.page("console", "logout");

		forgetUser();
	});
</script>

<AuthOnly>
	<LoadingFrame />
</AuthOnly>
