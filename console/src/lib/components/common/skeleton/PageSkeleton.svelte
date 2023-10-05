<script>
	import Card from "$lib/components/common/card/Card.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
</script>

<div class="p-10">
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-1">
			<Card>
				<div class="p-8 h-[160px] flex flex-col justify-between">
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
				</div>
			</Card>
		</div>
		<div class="col-span-1">
			<Card>
				<div class="p-8 h-[160px] flex flex-col justify-between">
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
				</div>
			</Card>
		</div>
		<div class="col-span-1">
			<Card>
				<div class="p-8 h-[160px] flex flex-col justify-between">
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
					<div
						class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
				</div>
			</Card>
		</div>
	</div>

	<Spacer size="md" />

	<Card>
		<div class="p-8 h-[160px] flex flex-col justify-between">
			<div
				class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
			<div
				class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
			<div
				class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
		</div>
	</Card>
	<Spacer size="md" />

	<Card>
		<div class="p-8 h-[300px] flex flex-col justify-between">
			<div
				class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
			<div
				class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
			<div
				class="h-4 rounded-full animate-pulse w-full bg-background-accent dark:bg-background-accent-dark" />
		</div>
	</Card>
</div>
