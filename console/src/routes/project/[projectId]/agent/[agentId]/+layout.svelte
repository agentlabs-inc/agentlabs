<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import { fetchAgentDetails } from "$lib/usecases/agents/fetchAgentDetails";
	import { page } from "$app/stores";
	import MainTitleSkeleton from "$lib/components/common/skeleton/MainTitleSkeleton.svelte";
	import { projectStore } from "$lib/stores/project";
	import { projectOverviewRoute } from "$lib/routes/routes";

	import TabNav from "$lib/components/common/navigation/tab-nav/TabNav.svelte";
	import { agentOverviewRoute, agentSettingsRoute } from "$lib/routes/routes";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";
	import PageSkeleton from "$lib/components/common/skeleton/PageSkeleton.svelte";
	import { goto } from "$app/navigation";
	import { agentStore, setCurrentAgent } from "$lib/stores/agent";

	const project = $projectStore.currentProject;

	if (!project) {
		throw new Error("Project not found");
	}

	const agentPromise = fetchAgentDetails($page.params.agentId).then((agent) => {
		if (!agent) {
			goto(projectOverviewRoute.path(project.id));
		}

		setCurrentAgent(agent);
		return agent;
	});

	$: navItems = $projectStore.currentProjectId
		? [
				{
					label: "General",
					path: agentOverviewRoute.path(
						$projectStore.currentProjectId,
						$page.params.agentId
					)
				},
				{
					label: "Settings",
					path: agentSettingsRoute.path(
						$projectStore.currentProjectId,
						$page.params.agentId
					)
				}
		  ]
		: [];
</script>

<div>
	<TopCover>
		<section class="px-12 pt-12 pb-0 flex flex-col justify-between h-full">
			<div class="flex items-center gap-4">
				{#await agentPromise}
					<div class="w-[300px]">
						<MainTitleSkeleton />
					</div>
				{:then agent}
					<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
						>{$agentStore.currentAgent?.name}</span>
					<CopiableTag value={agent.id} />
				{/await}
			</div>
			<TabNav items={navItems} />
		</section>
	</TopCover>
	{#await agentPromise}
		<PageSkeleton />
	{:then agent}
		<slot />
	{/await}
</div>
