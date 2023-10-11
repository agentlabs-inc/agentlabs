<script lang="ts">
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";
	import type { Theme } from "$lib/stores/theme";
	import { themeStore } from "$lib/stores/theme";

	export let theme: Theme = $themeStore;
</script>

<div
	class="min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
	<div class="flex flex-col animate-pulse">
		<AgentLabsLogo theme={theme} />
	</div>
</div>
