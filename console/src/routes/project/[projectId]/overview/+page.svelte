<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import AgentsGrid from "$lib/components/project/agents/agents-grid/AgentsGrid.svelte";
	import { page } from "$app/stores";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";
	import { projectStore } from "$lib/stores/project";

	const { projectId } = $page.params;

	const project = $projectStore.currentProject;
</script>

<div>
	<TopCover>
		<section class="p-12 flex items-center gap-4">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>{project?.name}</span>
			<CopiableTag value={project?.id ?? "Project ID"} />
		</section>
	</TopCover>
	<div class="w-full p-10 pb-32">
		<div class="max-w-6xl m-auto mt-10">
			<AgentsGrid projectId={projectId} />
		</div>
	</div>
</div>
