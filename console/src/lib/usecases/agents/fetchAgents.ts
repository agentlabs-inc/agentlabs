import type { Agent } from "$lib/entities/agent/agent";
import { AgentsService } from "$lib/services/gen-api";

export const fetchAgents = async (projectId: string): Promise<Agent[]> => {
	const result = await AgentsService.listForProject({
		projectId
	});

	return result.items.map((item) => ({
		id: item.id,
		name: item.name,
		createdAt: new Date(item.createdAt),
		updatedAt: new Date(item.updatedAt)
	}));
};
