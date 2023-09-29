import { Injectable, Logger } from '@nestjs/common';
import { RegisterConnectionPayload } from 'src/agent-connection-manager/agent-connection-manager.types';
import { FrontendConnection } from './frontend-connection-manager.types';

@Injectable()
export class FrontendConnectionManagerService {
  private readonly logger = new Logger(FrontendConnectionManagerService.name);

  private readonly sidToConnection = new Map<string, FrontendConnection>();
  private readonly agentKeyToConnection = new Map<string, FrontendConnection>();

  constructor() {
    setInterval(() => {
      const count = this.sidToConnection.size;

      this.logger.debug(`Frontend connections: ${count}`);
    }, 10_000);
  }

  private computeAgentKey(projectId: string, agentId: string) {
    return `${projectId}:${agentId}`;
  }

  getConnectionBySid(sid: string): FrontendConnection | undefined {
    return this.sidToConnection.get(sid);
  }

  registerConnection({
    socket,
    agentId,
    projectId,
  }: RegisterConnectionPayload) {
    const agentKey = this.computeAgentKey(projectId, agentId);
    const connection: FrontendConnection = {
      agentId,
      projectId,
      socket,
      createdAt: new Date(),
      agentKey,
    };

    this.sidToConnection.set(socket.id, connection);
    this.agentKeyToConnection.set(agentKey, connection);
  }

  removeConnectionBySid(sid: string): boolean {
    const connection = this.sidToConnection.get(sid);

    if (!connection) {
      return false;
    }

    this.sidToConnection.delete(sid);
    this.agentKeyToConnection.delete(connection.agentKey);

    return true;
  }
}
