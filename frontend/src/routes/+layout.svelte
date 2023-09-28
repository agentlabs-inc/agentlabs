<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { themeStore } from "$lib/stores/theme";

	export let data: LayoutData;

	import { browser } from "$app/environment";

	let darkMode = $themeStore === "dark";

	if (browser) {
		if (darkMode) {
			document.documentElement.classList.add("dark");
			darkMode = true;
		} else {
			document.documentElement.classList.remove("dark");
			darkMode = false;
		}
	}
</script>

{#await data.lazy.context}
	<LoadingFrame theme={$themeStore} />
{:then context}
	<slot />
{/await}
