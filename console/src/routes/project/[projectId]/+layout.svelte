<script>
	import TopNav from "$lib/components/common/navigation/top-nav/TopNav.svelte";
	import LeftNav from "$lib/components/common/navigation/left-nav/LeftNav.svelte";
	import { projectStore } from "$lib/stores/project";
	import ProjectContext from "$lib/context/ProjectContext.svelte";
	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>Project | AgentLabs</title>
</svelte:head>

<ProjectContext projectId={$page.params.projectId}>
	<div class="bg-background-primary dark:bg-background-primary-dark min-h-screen flex flex-col">
		<TopNav />
		<div class="flex flex-row grow">
			<LeftNav projectId={$projectStore.currentProjectId} />
			<div class="grow">
				<slot />
			</div>
		</div>
	</div>
</ProjectContext>
