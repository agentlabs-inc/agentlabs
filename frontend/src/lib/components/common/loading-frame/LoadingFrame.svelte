<script lang="ts">
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";
	import { browser } from "$app/environment";
	import { themeStore } from "$lib/stores/theme";

	if (browser) {
		if ($themeStore === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}
</script>

<div
	class="min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
	<div class="flex flex-col animate-pulse">
		<AgentLabsLogo theme={$themeStore} />
	</div>
</div>
