import type { Agent } from "$lib/entities/agent/agent";
import { AgentsService } from "$lib/services/gen-api";
import { setAvailableAgents } from "$lib/stores/agent";

export const fetchAgents = async (projectId: string): Promise<Agent[]> => {
	const { items: agents } = await AgentsService.listForProject({ projectId })

	setAvailableAgents(agents);

	return agents;
};
