import type { AgentConnection } from "$lib/entities/agent/agent-connection"
import { AgentsService } from "$lib/services/gen-api"

export const fetchRealtimeConnections = async (agentId: string): Promise<AgentConnection[]> => {
	const data = await AgentsService.getAllConnectionsByAgent({ agentId })

	return data.items.map<AgentConnection>((item) => ({
		id: item.sid,
		agentId: item.agentId,
		ip: item.ip,
		createdAt: item.createdAt,
	}))
}
