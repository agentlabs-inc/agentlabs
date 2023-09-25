<script lang="ts">
	import type { TabItem } from "./types";
	import { createEventDispatcher } from "svelte";

	export let items: TabItem[];

	export let defaultActive: string;

	let activeItemId = defaultActive;

	$: tabItems = items.map((item) => {
		return {
			...item,
			isActive: item.id === activeItemId
		};
	});

	const dispatch = createEventDispatcher<{
		change: {
			item: TabItem;
		};
	}>();

	const handleChange = (item: TabItem) => {
		activeItemId = item.id;
		dispatch("change", { item });
	};
</script>

<div class="flex gap-3">
	{#each tabItems as item}
		<button
			on:click={() => handleChange(item)}
			class="{item.isActive
				? 'border-b-2'
				: ''} hover:border-b-2 text-sm text-body-accent dark:text-body-accent-dark cursor-pointer border-stroke-accent dark:border-stroke-accent-dark border-inset">
			<span
				class="{item.isActive
					? 'bg-background-accent dark:bg-background-accent-dark'
					: ''} rounded-md inline-block py-3 px-4 mb-1 hover:bg-background-accent dark:hover:bg-background-accent-dark"
				>{item.label}</span>
		</button>
	{/each}
</div>
