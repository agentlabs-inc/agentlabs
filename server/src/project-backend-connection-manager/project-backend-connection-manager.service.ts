import { Injectable, Logger } from '@nestjs/common';
import { minutes, seconds } from 'src/common/ms-time';
import { PrismaService } from 'src/prisma/prisma.service';
import { SerializedProjectBackendConnectionDto } from './dto/serialized-project-backend-connection.dto';
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
  private readonly heartbeatTimeout = seconds(30);
  private readonly heartbeatInterval = minutes(1);

  constructor(private readonly prisma: PrismaService) {
    setInterval(() => {
      const agentCount = this.keyToConnection.size;

      this.logger.debug(`Connected agents: ${agentCount}`);
    }, 5000);

    setInterval(() => {
      for (const [, connection] of this.keyToConnection) {
        this.sendHeartbeat(connection);
      }
    }, this.heartbeatInterval);
  }

  private async sendHeartbeat(connection: AgentConnection) {
    const sid = connection.socket.id;

    if (connection.socket.disconnected) {
      this.removeConnectionBySid(sid);
      return;
    }

    try {
      await connection.socket
        .timeout(this.heartbeatTimeout)
        .emitWithAck('heartbeat', {
          timestamp: new Date().toISOString(),
        });
    } catch (e) {
      this.logger.debug(
        `Removing connection ${sid} from project ${connection.projectId} due to heartbeat timeout`,
      );
      this.removeConnectionBySid(sid);
      connection.socket.disconnect(true);
    }
  }

  private computeAgentKey(projectId: string): string {
    return `${projectId}`;
  }

  private getConnectionByAgentKey(agentKey: string): AgentConnection | null {
    return this.keyToConnection.get(agentKey) || null;
  }

  serializeConnection(
    connection: AgentConnection,
  ): SerializedProjectBackendConnectionDto {
    return {
      id: connection.socket.id,
      projectId: connection.projectId,
      createdAt: connection.createdAt.toISOString(),
      ipAddress: connection.ip,
    };
  }

  getSerializedProjectConnections(
    projectId: string,
  ): SerializedProjectBackendConnectionDto[] {
    const projectConnections = Array.from(this.keyToConnection.values()).filter(
      (connection) => connection.projectId === projectId,
    );

    return projectConnections.map((connection) =>
      this.serializeConnection(connection),
    );
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
