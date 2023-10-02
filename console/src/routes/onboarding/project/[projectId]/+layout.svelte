<script>
	import ProjectContext from "$lib/context/ProjectContext.svelte";
	import { page } from "$app/stores";
</script>

<ProjectContext projectId={$page.params.projectId}>
	<slot />
</ProjectContext>
