<script lang="ts">
	import { goto } from "$app/navigation";
	import { agentOverviewRoute } from "$lib/routes/routes";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	onMount(() => {
		goto(agentOverviewRoute.path($page.params.projectId, $page.params.agentId));
	});
</script>
