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
	import { agentOverviewRoute, createAgentRoute } from "$lib/routes/routes";
	import EmptyState from "$lib/components/common/empty-state/EmptyState.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { Plus } from "svelte-hero-icons";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";

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
		goto(agentOverviewRoute.path(projectId, agent.id));
	};
</script>

<div>
	{#if isLoading}
		<div class="col-span-2">
			<CardSkeleton />
		</div>
		<div class="col-span-2">
			<CardSkeleton />
		</div>
	{:else if agents.length === 0}
		<div class="col-span-6">
			<EmptyState
				title="Create your first Agent"
				description="You don't have any agent yet. Create your first agent to let magic happen.">
				<Button
					type="primary"
					leftIcon={Plus}
					on:click={() => goto(createAgentRoute.path(projectId))}>Create my agent</Button>
			</EmptyState>
		</div>
	{:else}
		<section class="antialiased">
			<div class="flex justify-between">
				<div>
					<Typography type="mainSectionTitle">Your AI Agents</Typography>
					<Typography type="subTitle"
						>Configure a AI agent so you can use it with your frontend.</Typography>
				</div>
				<div>
					<Button
						type="primary"
						leftIcon={Plus}
						on:click={() => goto(createAgentRoute.path(projectId))}
						>Create an agent</Button>
				</div>
			</div>
		</section>
		<Spacer size="md" />
		<div class="grid grid-cols-6 gap-4">
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
		</div>
	{/if}
</div>
