<script lang="ts">
	import "../app.css";
	import { SvelteToast } from "@zerodevx/svelte-toast";

	import { env } from "$env/dynamic/public";
	import { validateEnv } from "$lib/utils/validateEnv";

	validateEnv(env);

	import { themeStore } from "$lib/stores/theme";
	import { browser } from "$app/environment";

	if (browser) {
		if ($themeStore === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}
</script>

<SvelteToast />
<slot />
