<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import LoadingFrame from "$lib/components/common/loading-frame/LoadingFrame.svelte";
	import { env } from "$env/dynamic/public";
	import { themeStore } from "$lib/stores/theme";
	import { browser } from "$app/environment";
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import { validateEnv } from "$lib/utils/validateEnv";
	import { onMount } from "svelte";

	export let data: LayoutData;


	if (browser) {
		if ($themeStore === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}

	validateEnv(env);

	let isLoaded = false;

	onMount(async () => {
		isLoaded = await data.mainLayoutLazy.isLoaded;
	})

</script>

{#if !isLoaded}
	<LoadingFrame />
{:else}
	<slot />
	<SvelteToast />
{/if}
