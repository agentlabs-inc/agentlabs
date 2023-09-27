<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { themeStore } from "$lib/stores/theme";

	export let data: LayoutData;
</script>

{#await data.lazy.context}
	<LoadingFrame theme={$themeStore} />
{:then context}
	<slot />
{/await}
