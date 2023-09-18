<script lang="ts">
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";

	import type { TableRow, TableColumn } from "$lib/components/common/table/types.js";

	export let columns: TableColumn[];
	export let rows: TableRow[];

	export let totalCount: number;
</script>

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
					{#if typeof column.format === "function"}
						<Typography type="body">{column.format(row[column.key])}</Typography>
					{:else}
						<Typography type="body">{row[column.key]}</Typography>
					{/if}
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
