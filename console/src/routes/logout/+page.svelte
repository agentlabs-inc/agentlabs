<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { logout } from "$lib/stores/auth";
	import AuthOnly from "$lib/gates/AuthOnly.svelte";

	logout();
</script>

<AuthOnly>
	<LoadingFrame />
</AuthOnly>
