<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { forgetMember } from "$lib/stores/auth";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";

	forgetMember();
</script>

<AuthOnly>
	<LoadingFrame />
</AuthOnly>
