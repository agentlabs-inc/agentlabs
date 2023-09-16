<script lang="ts">
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { homeRoute } from "$lib/routes/routes";

	export const csr = true;

	onMount(async () => {
		console.log("GOTO MAIN");
		await goto(homeRoute.path());
	});
</script>

<LoadingFrame />
