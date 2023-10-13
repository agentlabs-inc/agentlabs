import { get, writable } from "svelte/store";
import type { Agent } from "$lib/entities/agent/agent";

export type AgentStore = {
	list: Agent[];
};

export const agentStore =  writable<AgentStore>({
	list: [],
});

export const setSelectedAgent = (agent: Agent) => {
	agentStore.update((store) => {
		return {
			...store,
			selectedAgent: agent
		};
	});
};

export const setAvailableAgents = (agents: Agent[]) => {
	agentStore.update((store) => {
		return {
			...store,
			list: agents
		};
	});
};

export const getAgentById = (id: string) => {
	return get(agentStore).list.find((agent) => agent.id === id);
}
