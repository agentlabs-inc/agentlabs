<script lang="ts">
	import { goto } from "$app/navigation";
	import { Icon } from "svelte-hero-icons";
	import type { NavItemType } from "./types";

	export let item: NavItemType;

	export let isActive: boolean;
</script>

<li
	role="menuitem"
	on:keydown={() => {}}
	on:click={() => goto(item.path)}
	class="{isActive ? 'bg-background-accent dark:bg-background-accent-dark' : ''}
					hover:bg-background-accent dark:hover:bg-background-accent-dark text-sm text-body-base dark:text-body-base-dark py-3 px-4 rounded-lg flex gap-2 items-center cursor-pointer">
	{#if item?.icon}
		<Icon src={item.icon} class="w-4" />
	{/if}
	{item.label}
</li>
