<script>
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";

	import { theme } from "$lib/store/theme";
</script>

<div class="min-h-screen bg-background-primary flex items-center justify-center">
	<div class="flex flex-col animate-pulse">
		<AgentLabsLogo theme={$theme} />
	</div>
</div>
