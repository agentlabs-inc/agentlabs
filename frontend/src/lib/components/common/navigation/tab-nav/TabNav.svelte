<script lang="ts">
	import type { TabNavItem } from "$lib/components/common/navigation/tab-nav/types";
	import { page } from "$app/stores";

	export let items: TabNavItem[];

	$: navItems = items.map((item) => {
		return {
			...item,
			isActive: item.path === $page.url.pathname
		};
	});
</script>

<div class="flex gap-3">
	{#each navItems as item}
		<a
			href={item.path}
			class="{item.isActive
				? 'border-b-2'
				: ''} hover:border-b-2 text-sm text-body-accent dark:text-body-accent-dark cursor-pointer border-stroke-accent dark:border-stroke-accent-dark border-inset"
			><span
				class="{item.isActive
					? 'bg-background-accent dark:bg-background-accent-dark'
					: ''} rounded-md inline-block py-3 px-4 mb-1 hover:bg-background-accent dark:hover:bg-background-accent-dark"
				>{item.label}</span
			></a>
	{/each}
</div>
