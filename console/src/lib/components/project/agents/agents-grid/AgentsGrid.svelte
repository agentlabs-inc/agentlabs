<script lang="ts">
	import { fetchAgents } from "$lib/usecases/agents/fetchAgents";
	import type { Agent } from "$lib/entities/agent/agent";
	import { onMount } from "svelte";
	import dayjs from "dayjs";
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import CardSkeleton from "$lib/components/common/card/CardSkeleton.svelte";
	import { toastError } from "$lib/utils/toast";
	import { goto } from "$app/navigation";
	import { agentOverviewRoute } from "$lib/routes/routes";

	export let projectId: string;

	let agents: Agent[] = [];
	let isLoading = true;

	onMount(async () => {
		isLoading = true;
		try {
			agents = await fetchAgents(projectId);
		} catch (e: any) {
			toastError(e?.message ?? "An error occurred");
			console.error(e);
		} finally {
			isLoading = false;
		}
	});

	const handleOpenAgent = (agent: Agent) => {
		console.log(agent);
		goto(agentOverviewRoute.path(projectId, agent.id));
	};
</script>

<div class="grid grid-cols-6 gap-4">
	{#if isLoading}
		<div class="col-span-2">
			<CardSkeleton />
		</div>
		<div class="col-span-2">
			<CardSkeleton />
		</div>
	{:else}
		{#each agents as agent}
			<div class="col-span-2">
				<Card clickable on:click={() => handleOpenAgent(agent)}>
					<div class="p-8 h-[160px] flex flex-col justify-between">
						<Typography type="sectionTitle">{agent.name}</Typography>
						<div>
							<Typography type="label">Created at</Typography>
							<Typography type="subTitle"
								>{dayjs(agent.createdAt).format("MMMM D, YYYY")}</Typography>
						</div>
					</div>
				</Card>
			</div>
		{/each}
	{/if}
</div>
