<script lang="ts">
	import { onMount } from "svelte";
	import { getContext } from "svelte";
	import { goto } from "$app/navigation";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { getAuthContext } from "$lib/context/auth.context";
	const { currentUser } = getAuthContext();

	const redirect = "/login";

	let loading = true;

	onMount(async () => {
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
