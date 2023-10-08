<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import TabNav from "$lib/components/common/navigation/tab-nav/TabNav.svelte";
	import { projectStore } from "$lib/stores/project";

	import { projectAuthMethodsRoute, projectMembersRoute } from "$lib/routes/routes";

	$: navItems = $projectStore?.currentProjectId
		? [
				{
					label: "Members",
					path: projectMembersRoute.path($projectStore.currentProjectId)
				},
				{
					label: "Auth methods",
					path: projectAuthMethodsRoute.path($projectStore.currentProjectId)
				}
		  ]
		: [];
</script>

<div>
	<TopCover>
		<section class="px-12 pt-12 pb-0 h-full flex flex-col gap-4 justify-between">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>Authentication</span>

			<TabNav items={navItems} />
		</section>
	</TopCover>
	<slot />
</div>
