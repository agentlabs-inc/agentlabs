import { writable } from "svelte/store";
import type { Agent } from "$lib/entities/agent/agent";

export type AgentStore = {
	currentAgent: Agent | null;
	currentAgentId: string | null;
};

export const agentStore = writable<AgentStore>({
	currentAgent: null,
	currentAgentId: null
});

export const setCurrentAgent = (agent: Agent | null) => {
	agentStore.update((store) => {
		return {
			...store,
			currentAgent: agent,
			currentAgentId: agent?.id ?? null
		};
	});
};
