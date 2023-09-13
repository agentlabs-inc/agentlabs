<script lang="ts">
	import { onMount } from "svelte";
	import { getContext } from "svelte";
	import { goto } from "$app/navigation";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	const { currentUser } = getContext("Auth");

	const redirect = "/login";

	let loading = true;

	onMount(async () => {
		console.log("ICI", $currentUser);
		if (!$currentUser) {
			await goto(redirect);
		}
		loading = false;
	});
</script>

{#if !loading}
	<slot />
{:else}
	<LoadingFrame />
{/if}
