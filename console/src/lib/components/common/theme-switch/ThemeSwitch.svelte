<script lang="ts">
	import { LightBulb, Icon } from "svelte-hero-icons";

	import { browser } from "$app/environment";

	import { themeStore } from "$lib/stores/theme";

	let darkMode = $themeStore === "dark";

	function handleSwitchDarkMode() {
		darkMode = !darkMode;
		themeStore.set(darkMode ? "dark" : "light");

		darkMode
			? document.documentElement.classList.add("dark")
			: document.documentElement.classList.remove("dark");
	}

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

<button
	on:click={handleSwitchDarkMode}
	class="bg-background-primary dark:bg-background-primary-dark border rounded-full border-stroke-base dark:border-stroke-base-dark p-2">
	<Icon src={LightBulb} class="w-5 text-body-base dark:text-body-base-dark" />
</button>
