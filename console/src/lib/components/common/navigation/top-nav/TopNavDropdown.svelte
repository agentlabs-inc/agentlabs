<script lang="ts">
	import { page } from "$app/stores";
	import type { NavItemType } from "$lib/components/common/navigation/nav-item/types";
	import { getAllProjects } from "$lib/stores/project.js";
	import { logoutRoute, projectOverviewRoute } from "$lib/routes/routes.js";
	import NavItem from "$lib/components/common/navigation/nav-item/NavItem.svelte";
	import { ArrowRightOnRectangle, Plus } from "svelte-hero-icons";
	import { clickOutside } from "$lib/utils/clickOutside";
	import { createEventDispatcher } from "svelte";

	const allProjects = getAllProjects();

	export let visible = false;

	let items: NavItemType[] = [
		...allProjects.map((p) => ({
			label: p.name,
			path: projectOverviewRoute.path(p.id)
		}))
	];

	const dispatch = createEventDispatcher();
	const onClickOutside = () => {
		console.log("click outside");
		if (visible) {
			// todo: fix this
			// dispatch("close");
		}
	};
</script>

<div
	use:clickOutside={onClickOutside}
	class="animate-in fade-in slide-down {visible
		? 'visible'
		: 'hidden'} absolute top-[100%] right-0 min-w-[300px] w-full border border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-primary-dark">
	<section class="p-3 border-b border-stroke-base dark:border-stroke-base-dark">
		<ul class="flex flex-col gap-3 antialiased">
			{#each items as item}
				<NavItem isActive={$page.url.pathname === item.path} item={item} />
			{/each}
		</ul>
	</section>
	<section class="p-3 border-b border-stroke-base dark:border-stroke-base-dark">
		<ul class="flex flex-col gap-3 antialiased">
			<NavItem
				isActive={false}
				item={{
					path: "#not-implemented",
					label: "New project",
					icon: Plus
				}} />
			<NavItem
				isActive={false}
				item={{
					path: logoutRoute.path(),
					label: "Sign out",
					icon: ArrowRightOnRectangle
				}} />
		</ul>
	</section>
</div>
