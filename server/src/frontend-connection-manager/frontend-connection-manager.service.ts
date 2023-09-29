import { Injectable, Logger } from '@nestjs/common';
import {
  FrontendConnection,
  RegisterFrontendConnectionPayload,
} from './frontend-connection-manager.types';

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

  private computeKey(projectId: string, agentId: string) {
    return `${projectId}:${agentId}`;
  }

  getConnectionBySid(sid: string): FrontendConnection | undefined {
    return this.sidToConnection.get(sid);
  }

  registerConnection({
    socket,
    agentId,
    projectId,
    userId,
  }: RegisterFrontendConnectionPayload) {
    const key = this.computeKey(projectId, agentId);
    const connection: FrontendConnection = {
      agentId,
      projectId,
      socket,
      createdAt: new Date(),
      key: key,
      userId,
    };

    this.sidToConnection.set(socket.id, connection);
    this.agentKeyToConnection.set(key, connection);
  }

  removeConnectionBySid(sid: string): boolean {
    const connection = this.sidToConnection.get(sid);

    if (!connection) {
      return false;
    }

    this.sidToConnection.delete(sid);
    this.agentKeyToConnection.delete(connection.key);

    return true;
  }
}
