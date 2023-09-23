<script lang="ts">
	import { ChartBar, UserGroup, Icon, Cog } from "svelte-hero-icons";
	import { page } from "$app/stores";
	import { authSettingsRoute, overviewRoute, settingsRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { projectStore } from "$lib/stores/project";
	import NavItem from "$lib/components/common/navigation/nav-item/NavItem.svelte";

	const items = [
		{
			label: "Overview",
			icon: ChartBar,
			path: overviewRoute.path($projectStore.currentProjectId)
		},
		{
			label: "Authentication",
			icon: UserGroup,
			path: authSettingsRoute.path($projectStore.currentProjectId)
		},
		{
			label: "Settings",
			icon: Cog,
			path: settingsRoute.path($projectStore.currentProjectId)
		}
	];
</script>

<div
	class="sticky top-0 min-h-full border-r border-stroke-base dark:border-stroke-base-dark w-[200px] bg-background-secondary dark:bg-background-primary-dark">
	<section class="p-5">
		<ul class="flex flex-col gap-3 antialiased">
			{#each items as item}
				<NavItem isActive={$page.url.pathname === item.path} item={item} />
			{/each}
		</ul>
	</section>
</div>
