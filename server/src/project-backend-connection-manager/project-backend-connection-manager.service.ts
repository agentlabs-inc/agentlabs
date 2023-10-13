import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AgentConnection,
  RegisterAgentConnectionPayload,
} from './project-backend-connection-manager.types';

@Injectable()
export class ProjectBackendConnectionManagerService {
  private sidToConnection = new Map<string, AgentConnection>();
  private keyToConnection = new Map<string, AgentConnection>();
  private readonly logger = new Logger(
    ProjectBackendConnectionManagerService.name,
  );

  constructor(private readonly prisma: PrismaService) {
    setInterval(() => {
      const agentCount = this.keyToConnection.size;

      this.logger.debug(`Connected agents: ${agentCount}`);
    }, 5000);
  }

  private computeAgentKey(projectId: string): string {
    return `${projectId}`;
  }

  private getConnectionByAgentKey(agentKey: string): AgentConnection | null {
    return this.keyToConnection.get(agentKey) || null;
  }

  getConnection(projectId: string): AgentConnection | null {
    const key = this.computeAgentKey(projectId);

    return this.getConnectionByAgentKey(key);
  }

  hasConnection(projectId: string): boolean {
    return !!this.getConnection(projectId);
  }

  getConnectionBySid(sid: string): AgentConnection | null {
    return this.sidToConnection.get(sid) || null;
  }

  async registerConnection({
    socket,
    projectId,
    ip,
  }: RegisterAgentConnectionPayload): Promise<void> {
    const key = this.computeAgentKey(projectId);
    const connection: AgentConnection = {
      projectId,
      key,
      socket,
      createdAt: new Date(),
      ip,
    };

    await this.prisma.projectBackendConnectionLog.create({
      data: {
        ipAddress: ip,
        projectId: projectId,
        id: socket.id,
      },
    });

    this.sidToConnection.set(socket.id, connection);
    this.keyToConnection.set(key, connection);
  }

  removeConnectionBySid(sid: string): boolean {
    const connection = this.getConnectionBySid(sid);

    if (!connection) {
      return false;
    }

    this.sidToConnection.delete(sid);
    this.keyToConnection.delete(connection.key);

    return true;
  }
}
