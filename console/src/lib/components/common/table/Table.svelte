<script lang="ts">
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";

	import type { TableRow, TableColumn } from "$lib/components/common/table/types.js";
	import CardSkeleton from "$lib/components/common/card/CardSkeleton.svelte";
	import EmptyState from "$lib/components/common/empty-state/EmptyState.svelte";
	import NormalCell from "$lib/components/common/table/NormalCell.svelte";
	import NotResultState from "$lib/components/common/empty-state/NotResultState.svelte";

	type T = $$Generic;
	type K = keyof T;
	export let columns: TableColumn<T, K>[];
	export let rows: TableRow<T>[];

	export let totalCount: number;

	export let isLoadingData: boolean;

	export let emptyTitle: string;

	export let emptyDescription: string;
</script>

{#if isLoadingData}
	<CardSkeleton />
{/if}

{#if !isLoadingData && totalCount === 0}
	<EmptyState title={emptyTitle} description={emptyDescription}>
		<slot name="empty-state-actions" />
	</EmptyState>
{:else if !isLoadingData && rows.length === 0}
	<NotResultState />
{/if}

{#if !isLoadingData && rows?.length > 0}
	<Card>
		<div
			class="py-5 px-6 grid grid-cols-5 w-full border-b border-stroke-base dark:border-stroke-base-dark">
			{#each columns as column}
				<Typography type="label">{column.name}</Typography>
			{/each}
		</div>
		<section>
			{#each rows as row}
				<div
					class="py-5 px-6 grid grid-cols-5 w-full border-b border-stroke-base dark:border-stroke-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
					{#each columns as column}
						<div class="flex items-center">
							<svelte:component
								this={column.customComponent ?? NormalCell}
								cellValue={column.format ? column.format(row) : row[column.key]} />
						</div>
					{/each}
				</div>
			{/each}
		</section>
	</Card>

	<div class="w-full flex justify-between mt-5">
		<div>
			<Typography type="body">Total: {totalCount}</Typography>
		</div>
	</div>
{/if}
