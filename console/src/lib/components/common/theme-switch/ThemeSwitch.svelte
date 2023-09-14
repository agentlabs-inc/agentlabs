<script lang="ts">
	import { LightBulb, Icon } from "svelte-hero-icons";

	import { browser } from "$app/environment";

	import { theme } from "$lib/store/theme";

	let darkMode = $theme;

	function handleSwitchDarkMode() {
		darkMode = !darkMode;
		theme.set(darkMode ? "dark" : "light");

		darkMode
			? document.documentElement.classList.add("dark")
			: document.documentElement.classList.remove("dark");
	}

	if (browser) {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
			darkMode = true;
		} else {
			document.documentElement.classList.remove("dark");
			darkMode = false;
		}
	}
</script>

<button
	on:click={handleSwitchDarkMode}
	class="bg-background-primary dark:bg-background-primary-dark border rounded-full border-stroke-base dark:border-stroke-base-dark p-2">
	<Icon src={LightBulb} class="w-5 text-body-base dark:text-body-base-dark" />
</button>
