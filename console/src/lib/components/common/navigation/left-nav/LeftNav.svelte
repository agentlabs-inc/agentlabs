<script lang="ts">
	import { ChartBar, UserGroup, CpuChip, Key } from "svelte-hero-icons";
	import { page } from "$app/stores";
	import {
		authSettingsRoute,
		overviewRoute,
		backendsRoute,
		secretsRoute
	} from "$lib/routes/routes";
	import NavItem from "$lib/components/common/navigation/nav-item/NavItem.svelte";

	export let projectId: string | null;

	$: items = projectId
		? [
				{
					label: "Overview",
					icon: ChartBar,
					path: overviewRoute.path(projectId)
				},
				{
					label: "Authentication",
					icon: UserGroup,
					path: authSettingsRoute.path(projectId)
				},
				{
					label: "Backends",
					icon: CpuChip,
					path: backendsRoute.path(projectId)
				},
				{
					label: "Secrets",
					icon: Key,
					path: secretsRoute.path(projectId)
				}
		  ]
		: [];
</script>

<div
	class="sticky top-0 min-h-full border-r border-stroke-base dark:border-stroke-base-dark w-[200px] bg-background-secondary dark:bg-background-primary-dark">
	<section class="p-5">
		<ul class="flex flex-col gap-3 antialiased">
			{#each items as item}
				<NavItem isActive={$page.url.pathname.includes(item.path)} item={item} />
			{/each}
		</ul>
	</section>
</div>
