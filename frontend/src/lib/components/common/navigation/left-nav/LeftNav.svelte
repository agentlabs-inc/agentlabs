<script lang="ts">
	import { ChartBar, User, UserGroup } from "svelte-hero-icons";
	import { page } from "$app/stores";
	import NavItem from "$lib/components/common/navigation/nav-item/NavItem.svelte";
	import SidebarHeader from "$lib/components/sidebar/header/SidebarHeader.svelte";

	$: items = [
		{
			label: "Agent A",
			icon: User,
			path: ""
		},
		{
			label: "Agent B",
			icon: User,
			path: ""
		}
	];
</script>

<div
	class="sticky top-0 min-h-full border-r border-stroke-base dark:border-stroke-base-dark w-[250px] bg-background-secondary dark:bg-background-primary-dark">
	<section>
		<SidebarHeader>Available Agents</SidebarHeader>
	</section>
	<section class="p-5">
		<ul class="flex flex-col gap-3 antialiased">
			{#each items as item}
				<NavItem isActive={false} item={item} />
			{/each}
		</ul>
	</section>
</div>
