import type { Agent } from "$lib/entities/agent/agent";
import { AgentsService } from "$lib/services/gen-api";

const waitForDelay = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

export const fetchAgentDetails = async (agentId: string): Promise<Agent> => {
	const item = await AgentsService.getById({
		agentId
	});

	await waitForDelay(2000);

	return {
		id: item.id,
		name: item.name,
		createdAt: new Date(item.createdAt),
		updatedAt: new Date(item.updatedAt)
	};
};
