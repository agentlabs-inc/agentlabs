<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { SvelteToast } from "@zerodevx/svelte-toast";
	export let data: LayoutData;
</script>

{#await data.lazy.context}
	<LoadingFrame />
{:then context}
	<SvelteToast />
	<slot />
{/await}
