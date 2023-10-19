<script lang="ts">
	import { LightBulb, Icon, ArrowRightOnRectangle } from "svelte-hero-icons";

	import { browser } from "$app/environment";

	import { themeStore } from "$lib/stores/theme";

	let darkMode = $themeStore === "dark";

	export let isNavItem = false;

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

{#if isNavItem}
	<li
		role="menuitem"
		on:keydown={() => {}}
		on:click={handleSwitchDarkMode}
		class="hover:bg-background-accent dark:hover:bg-background-accent-dark text-sm text-body-base dark:text-body-base-dark py-3 px-4 rounded-lg flex gap-2 items-center cursor-pointer">
		<Icon src={LightBulb} class="w-4" />
		Switch light
	</li>
{:else}
	<button
		on:click={handleSwitchDarkMode}
		class="bg-background-primary dark:bg-background-primary-dark border rounded-full border-stroke-base dark:border-stroke-base-dark p-2">
		<Icon src={LightBulb} class="w-5 text-body-base dark:text-body-base-dark" />
	</button>
{/if}
