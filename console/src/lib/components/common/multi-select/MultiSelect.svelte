<script lang="ts">
	import type { MultiSelectItem } from "$lib/components/common/multi-select/types";
	import { Icon } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{ change: MultiSelectItem[] }>();
	export let items: MultiSelectItem[] = [];

	let selectedItems: Record<string, MultiSelectItem> = {};

	const handleSelect = (item: MultiSelectItem) => {
		if (selectedItems[item.id]) {
			delete selectedItems[item.id];
			selectedItems = { ...selectedItems };
		} else {
			selectedItems[item.id] = item;
			selectedItems = { ...selectedItems };
		}

		dispatch("change", Object.values(selectedItems));
	};
</script>

<div class="grid grid-cols-2 gap-3">
	{#each items as item}
		<button
			id={item.id}
			on:click={() => handleSelect(item)}
			class="antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center justify-left gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer {selectedItems[
				item.id
			]
				? 'border border-stroke-info dark:border-stroke-info-dark'
				: ''}">
			{#if item.heroIcon}
				<div
					class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
					<Icon src={item.heroIcon} width="20" class="text-body-subdued" />
				</div>
			{/if}
			{#if item.customIcon}
				<div
					class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
					<svelte:component this={item.customIcon} />
				</div>
			{/if}
			<span>{item.label}</span>
		</button>
	{/each}
</div>
