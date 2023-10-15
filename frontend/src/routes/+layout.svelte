<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { env } from "$env/dynamic/public";
	import { themeStore } from "$lib/stores/theme";

	export let data: LayoutData;

	import { browser } from "$app/environment";
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import { validateEnv } from "$lib/utils/validateEnv";

	if (browser) {
		if ($themeStore === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}

	validateEnv(env);
</script>

{#await data.mainLayoutLazy.isLoaded}
	<LoadingFrame />
{:then context}
	<slot />
	<SvelteToast />
{/await}
