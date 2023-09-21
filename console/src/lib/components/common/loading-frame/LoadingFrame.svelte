<script lang="ts">
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";

	import { themeStore } from "$lib/stores/theme";
</script>

<div class="min-h-screen bg-background-primary flex items-center justify-center">
	<div class="flex flex-col animate-pulse">
		<AgentLabsLogo theme={$themeStore} />
	</div>
</div>
