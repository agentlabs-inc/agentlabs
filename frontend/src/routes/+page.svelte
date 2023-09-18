<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	export const csr = true;

	onMount(() => {
		goto("/main");
	});
</script>

<LoadingFrame />
