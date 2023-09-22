<script lang="ts">
	import { projectStore } from "$lib/stores/project";
	import { goto } from "$app/navigation";
	import { projectOverviewRoute } from "$lib/routes/routes";

	goto(projectOverviewRoute.path($projectStore.currentProjectId));
</script>
