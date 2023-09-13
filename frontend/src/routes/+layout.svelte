<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import AgentLabsLogo from "$lib/components/common/logo/AgentLabsLogo.svelte";

	export let data: LayoutData;
</script>

{#await data.lazy.context}
	<div class="min-h-screen bg-background-primary flex items-center justify-center">
		<div class="flex flex-col animate-pulse">
			<AgentLabsLogo />
		</div>
	</div>
{:then context}
	<slot />
{/await}
