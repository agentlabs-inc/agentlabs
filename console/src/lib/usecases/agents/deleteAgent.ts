import { AgentsService } from "$lib/services/gen-api";

export const deleteAgent = async (agentId: string): Promise<void> => {
	await AgentsService.deleteAgent({
		agentId
	});
};
