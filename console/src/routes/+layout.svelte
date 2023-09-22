<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";

	export let data: LayoutData;
</script>

{#await data.lazy.context}
	<LoadingFrame />
{:then context}
	<slot />
{/await}
