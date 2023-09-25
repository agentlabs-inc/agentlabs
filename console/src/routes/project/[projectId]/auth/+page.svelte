<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { projectMembersRoute } from "$lib/routes/routes";
	import { projectStore } from "$lib/stores/project";

	onMount(async () => {
		if (!$projectStore.currentProjectId) return;

		await goto(projectMembersRoute.path($projectStore.currentProjectId));
	});
</script>
