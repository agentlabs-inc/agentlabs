<script lang="ts">
	import Alert from "$lib/components/common/alert/Alert.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import CopiableCell from "$lib/components/common/table/CopiableCell.svelte";
	import Table from "$lib/components/common/table/Table.svelte";
	import type { TableColumn } from "$lib/components/common/table/types";
	import type { AgentConnection } from "$lib/entities/agent/agent-connection";
	import { agentStore } from "$lib/stores/agent";
	import { fetchRealtimeConnections } from "$lib/usecases/agents/fetchRealtimeConnections";
	import { durationToHumanReadable } from "$lib/utils/time";
	import dayjs from "dayjs";
	import { onDestroy, onMount } from "svelte";

	interface AgentConnectionRow {
		id: string;
		ip: string;
		createdAt: string;
		lifetime: number;
	}

	const columns: TableColumn<AgentConnectionRow, keyof AgentConnectionRow>[] = [
		{
			name: "ID",
			key: "id",
			customComponent: CopiableCell
		},
		{
			name: "IP Address",
			key: "ip"
		},
		{
			name: "Lifetime",
			key: "lifetime",
			format: ({ lifetime }: AgentConnectionRow) => durationToHumanReadable(lifetime)
		},
		{
			name: "Connected at",
			key: "createdAt",
			format: (connection: AgentConnection) => dayjs(connection.createdAt).format("MMMM D, YYYY [at] h:mm A")
		},
	];


	const agentConnectionToRow = (connection: AgentConnection): AgentConnectionRow => ({
		id: connection.id,
		ip: connection.ip,
		createdAt: connection.createdAt,
		lifetime: new Date().getTime() - new Date(connection.createdAt).getTime()
	});

	let rows: AgentConnectionRow[] = [];

	const agent = $agentStore.currentAgent;
	let connections: AgentConnection[] = [];
	let isLoadingData = false;
	let lifetimeInterval: ReturnType<typeof setInterval> | null = null;

	onMount(async () => {
		if (!agent) {
			return ;
		}

		try {
			 isLoadingData = true
			 connections = await fetchRealtimeConnections(agent.id);
			 rows = connections.map(agentConnectionToRow);

			 lifetimeInterval = setInterval(async () => {
			 	rows = connections.map(agentConnectionToRow);
			 }, 1000);
		} finally {
			isLoadingData = false
		}

	});

	onDestroy(() => {
		if (lifetimeInterval) {
			clearInterval(lifetimeInterval);
		}
	});
</script>

<div class="w-full p-10 pb-32">
	<div class="max-w-6xl m-auto mt-10">
		<Table
			isLoadingData={isLoadingData}
			totalCount={connections.length}
			columns={columns}
			rows={rows}
			emptyTitle="No backend is connected"
			emptyDescription="Your agent is currently offline as there is no backend to power it. As soon as you connect one, it will appear here." />
		<Spacer size='md' />
		{#if connections.length > 0}
			<Alert type='warning'>
				AgentLabs currently only supports one backend connection per agent, which is not ideal from a scalability perspective. Support for multiple backend connections is planned and will ship in the near future.
			</Alert>
		{/if}
	</div>
</div>
