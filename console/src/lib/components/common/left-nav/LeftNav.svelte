<script lang="ts">
	import { ChartBar, UserGroup, Icon, Cog } from "svelte-hero-icons";
	import { page } from "$app/stores";
	import { authSettingsRoute, overviewRoute, settingsRoute } from "$lib/routes/routes";
	import { goto } from "$app/navigation";
	import { projectStore } from "$lib/stores/project";

	const items = [
		{
			name: "Overview",
			icon: ChartBar,
			path: overviewRoute.path($projectStore.currentProjectId)
		},
		{
			name: "Authentication",
			icon: UserGroup,
			path: authSettingsRoute.path($projectStore.currentProjectId)
		},
		{
			name: "Settings",
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
				<li
					on:click={() => goto(item.path)}
					class="{$page.url.pathname === item.path
						? 'bg-background-accent dark:bg-background-accent-dark'
						: ''}
					hover:bg-background-accent dark:hover:bg-background-accent-dark text-sm text-body-base dark:text-body-base-dark py-3 px-4 rounded-lg flex gap-2 items-center cursor-pointer">
					<Icon src={item.icon} class="w-4" />
					{item.name}
				</li>
			{/each}
		</ul>
	</section>
</div>
