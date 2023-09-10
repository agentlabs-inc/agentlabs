import { Socket } from "socket.io";

interface RegisteredAgent {
	agentId: string;
	socket: Socket;
}

interface AgentInfo {
	id: string;
}

type AgentId = string;

export class AgentManager {
	private readonly agentMap: Map<AgentId, RegisteredAgent> = new Map();

	constructor() {}

	public toAgentInfo(agent: RegisteredAgent): AgentInfo {
		return {
			id: agent.agentId,
		};
	}

	public listAgents(): AgentInfo[] {
		return Array.from(this.agentMap.values()).map(this.toAgentInfo);
	}

	public upsertAgentRegistration(agentId: string, socket: Socket) {
		const agent = this.getAgent(agentId);

		if (agent) {
			console.debug(`Agent ${agentId} already registered, disconnecting old socket`)
			agent.socket.disconnect();
		}

		console.debug(`Registering agent ${agentId}`)
		this.agentMap.set(agentId, { agentId, socket });

		socket.on('disconnect', () => {
			console.debug(`Agent ${agentId} disconnected, removing from agent map`)
			this.agentMap.delete(agentId);
		});
	}

	public getAgent(agentId: string): RegisteredAgent | null {
		return this.agentMap.get(agentId) ?? null;
	}
}
