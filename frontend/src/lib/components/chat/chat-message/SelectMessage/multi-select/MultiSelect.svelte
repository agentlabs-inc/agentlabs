<script lang="ts">
	import { Icon } from "svelte-hero-icons";
	import { createEventDispatcher } from "svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import MessageInputButton from "$lib/components/chat/chat-message/MessageInputButton.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import type { MultiSelectChoice } from "./types";

	export let minSelected: number;
	export let maxSelected: number;

	const dispatch = createEventDispatcher<{
		change: MultiSelectChoice[];
		submit: MultiSelectChoice[];
	}>();
	export let items: MultiSelectChoice[] = [];

	let selectedItems: Record<string, MultiSelectChoice> = {};

	const handleSelect = (item: MultiSelectChoice) => {
		if (item.disabled) return;

		if (selectedItems[item.id]) {
			delete selectedItems[item.id];
			selectedItems = { ...selectedItems };
		} else {
			selectedItems[item.id] = item;
			selectedItems = { ...selectedItems };
		}

		dispatch("change", Object.values(selectedItems));
	};

	let confirmedOnce = false;

	const handleConfirm = () => {
		confirmedOnce = true;
		if (hasError) return;
		dispatch("submit", Object.values(selectedItems));
	};

	$: selectedItemCount = Object.keys(selectedItems).length;
	$: hasMinError = confirmedOnce && selectedItemCount < minSelected;
	$: hasMaxError = confirmedOnce && selectedItemCount > maxSelected;
	$: hasError = hasMinError || hasMaxError;
</script>

<div class="flex gap-2 flex-col flex-grow">
	{#each items as item}
		<button
			id={item.id}
			disabled={item.required}
			on:click={() => handleSelect(item)}
			class="{item.disabled
				? 'opacity-60 bg-background-accent dark:bg-background-accent-dark'
				: ''} antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center w-full flex-grow justify-left gap-3 text-body-base dark:text-body-base-dark bg-white dark:bg-background-primary-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer {selectedItems[
				item.id
			] || item.selected
				? 'border border-stroke-info dark:border-stroke-info-dark'
				: ''}">
			{#if item.heroIcon}
				<div
					class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
					<Icon src={item.heroIcon} width="20" class="text-body-subdued" />
				</div>
			{/if}
			<span>{item.label}</span>
			{#if item.disabledLabel}
				<Typography type="label">{item.disabledLabel}</Typography>
			{/if}
		</button>
	{/each}
	{#if hasMaxError}
		<span class="text-body-error dark:text-body-error-dark"
			>You must select at most {maxSelected}.</span>
	{/if}
	{#if hasMinError}
		<span class="text-body-error dark:text-body-error-dark"
			>You must select at least {minSelected}.</span>
	{/if}
	<Spacer size="xs" />
	<MessageInputButton disabled={hasError} on:click={handleConfirm}>Confirm</MessageInputButton>
</div>
