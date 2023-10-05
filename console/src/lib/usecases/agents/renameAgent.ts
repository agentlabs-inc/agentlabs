import type { Agent } from "$lib/entities/agent/agent";
import { AgentsService } from "$lib/services/gen-api";
import { setCurrentAgent } from "$lib/stores/agent";

export const renameAgent = async (params: { agentId: string; name: string }): Promise<Agent> => {
	const result = await AgentsService.updateAgent({
		agentId: params.agentId,
		requestBody: {
			name: params.name
		}
	});

	const agent = {
		...result,
		createdAt: new Date(result.createdAt),
		updatedAt: new Date(result.updatedAt)
	};

	setCurrentAgent(agent);

	return agent;
};
