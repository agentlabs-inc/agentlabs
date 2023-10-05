import type { Agent } from "$lib/entities/agent/agent";
import { AgentsService } from "$lib/services/gen-api";

export const createAgent = async (params: { projectId: string; name: string }): Promise<Agent> => {
	const agent = await AgentsService.createAgent({
		requestBody: {
			projectId: params.projectId,
			name: params.name
		}
	});

	return {
		...agent,
		createdAt: new Date(agent.createdAt),
		updatedAt: new Date(agent.updatedAt)
	};
};
