<script lang="ts">
	import { Icon, DocumentDuplicate, CursorArrowRays, BookOpen } from "svelte-hero-icons";
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import type { PageData } from "./$types";
	import { fetchAgentDetails } from "$lib/usecases/agents/fetchAgentDetails";
	import { page } from "$app/stores";
	import MainTitleSkeleton from "$lib/components/common/skeleton/MainTitleSkeleton.svelte";
	import { projectStore } from "$lib/stores/project";
	import {
		onboardingPythonCode,
		onboardingTypescriptCode
	} from "$lib/components/project/agents/code-snippets/onboarding.snippet";

	export let data: PageData;

	import { PUBLIC_AI_AGENT_DOMAIN } from "$env/static/public";
	import TabNav from "$lib/components/common/navigation/tab-nav/TabNav.svelte";
	import { agentOverviewRoute, agentSettingsRoute } from "$lib/routes/routes";
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";

	const project = $projectStore.currentProject;

	console.log("project", project);

	if (!project) {
		throw new Error("Project not found");
	}

	const tabItems: {
		value: string;
		id: string;
		label: string;
	}[] = [
		{
			id: "python",
			label: "Python",
			value: "python"
		},
		{
			id: "typescript",
			label: "Typescript",
			value: "typescript"
		}
	];

	const agentPromise = fetchAgentDetails($page.params.agentId);

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
						>{agent.name}</span>
					<CopiableTag value={agent.id} />
				{/await}
			</div>
			<TabNav items={navItems} />
		</section>
	</TopCover>
	<slot />
</div>
