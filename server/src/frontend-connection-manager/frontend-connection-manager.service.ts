import { Injectable, Logger } from '@nestjs/common';
import {
  ComputeFrontendConnectionKeyPayload,
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

  private computeKey({
    projectId,
    agentId,
    memberId,
  }: ComputeFrontendConnectionKeyPayload) {
    return `${projectId}:${agentId}:${memberId}`;
  }

  getConnectionBySid(sid: string): FrontendConnection | undefined {
    return this.sidToConnection.get(sid);
  }

  registerConnection({
    socket,
    agentId,
    projectId,
    memberId,
  }: RegisterFrontendConnectionPayload) {
    const key = this.computeKey({
      agentId,
      projectId,
      memberId,
    });
    const connection: FrontendConnection = {
      agentId,
      projectId,
      socket,
      createdAt: new Date(),
      key: key,
      memberId,
    };

    this.sidToConnection.set(socket.id, connection);
    this.agentKeyToConnection.set(key, connection);
  }

  getConnection(
    payload: ComputeFrontendConnectionKeyPayload,
  ): FrontendConnection | null {
    const key = this.computeKey(payload);

    return this.agentKeyToConnection.get(key) ?? null;
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
