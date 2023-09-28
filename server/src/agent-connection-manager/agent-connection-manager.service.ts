import { Injectable, Logger } from '@nestjs/common';
import {
  AgentConnection,
  RegisterConnectionPayload,
} from './agent-connection-manager.types';

@Injectable()
export class AgentConnectionManagerService {
  private sidToConnection = new Map<string, AgentConnection>();
  private agentKeyToConnection = new Map<string, AgentConnection>();
  private readonly logger = new Logger(AgentConnectionManagerService.name);

  constructor() {
    setInterval(() => {
      const agentCount = this.agentKeyToConnection.size;

      this.logger.debug(`Connected agents: ${agentCount}`);
    }, 5000);
  }

  private computeAgentKey(projectId: string, agentId: string): string {
    return `${projectId}:${agentId}`;
  }

  private getConnectionByAgentKey(agentKey: string): AgentConnection | null {
    return this.agentKeyToConnection.get(agentKey) || null;
  }

  getConnection(projectId: string, agentId: string): AgentConnection | null {
    const key = this.computeAgentKey(projectId, agentId);

    return this.getConnectionByAgentKey(key);
  }

  hasConnection(projectId: string, agentId: string): boolean {
    return !!this.getConnection(projectId, agentId);
  }

  getConnectionBySid(sid: string): AgentConnection | null {
    return this.sidToConnection.get(sid) || null;
  }

  registerConnection({
    socket,
    projectId,
    agentId,
  }: RegisterConnectionPayload): void {
    const key = this.computeAgentKey(projectId, agentId);
    const connection: AgentConnection = {
      projectId,
      agentId,
      agentKey: key,
      socket,
      createdAt: new Date(),
    };

    this.sidToConnection.set(socket.id, connection);
    this.agentKeyToConnection.set(key, connection);
  }

  removeConnectionBySid(sid: string): boolean {
    const connection = this.getConnectionBySid(sid);

    if (!connection) {
      return false;
    }

    this.sidToConnection.delete(sid);
    this.agentKeyToConnection.delete(connection.agentKey);

    return true;
  }
}
