import { writable } from "svelte/store";
import type { Agent } from "$lib/entities/agent/agent";
import { createLocalStorage, persist } from "@macfja/svelte-persistent-store";
import { genStoreKey } from "$lib/utils/genStoreKey";

export type AgentStore = {
	selectedAgent: Agent | null;
	list: Agent[];
};

const AGENT_STORE_KEY = genStoreKey("agent-store");

export const agentStore = persist(
	writable<AgentStore>({
		selectedAgent: null,
		list: [],
	}),
	createLocalStorage(),
	AGENT_STORE_KEY
);

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
