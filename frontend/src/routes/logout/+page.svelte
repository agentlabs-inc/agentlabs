<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { forgetMember } from "$lib/stores/auth";

	forgetMember();
</script>

<LoadingFrame />
