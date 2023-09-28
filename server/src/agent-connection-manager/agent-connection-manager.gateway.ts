import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AGENT_SOCKETIO_NAMESPACE } from './agent-connection-manager.constants';
import { AgentConnectionManagerService } from './agent-connection-manager.service';

@WebSocketGateway({ namespace: AGENT_SOCKETIO_NAMESPACE })
export class AgentConnectionManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly agentConnectionManagerService: AgentConnectionManagerService,
  ) {}

  private readonly logger = new Logger(AgentConnectionManagerGateway.name);

  handleConnection(client: Socket) {
    const projectId = client.handshake.headers['x-agentlabs-project-id'];
    const agentId = client.handshake.headers['x-agentlabs-agent-id'];

    this.logger.debug(
      `Client connected: SID=${client.id},AGENT=${agentId},PROJECT=${projectId}`,
    );

    if (typeof projectId !== 'string') {
      const message =
        'Missing header: X-AgentLabs-Project-Id, closing connection';

      this.logger.error('Client disconnected: MISSING_PROJECT_ID');
      client.send({
        message,
      });
      client.disconnect(true);
      return;
    }

    if (typeof agentId !== 'string') {
      const message =
        'Missing header: X-AgentLabs-Agent-Id, closing connection';
      this.logger.error('Client disconnected: MISSING_AGENT_ID');
      client.send({
        message,
      });
      client.disconnect(true);
      return;
    }

    if (this.agentConnectionManagerService.hasConnection(projectId, agentId)) {
      const message = `Agent ${agentId} is already connected to project ${projectId}`;

      this.logger.error('Client disconnected: ALREADY_CONNECTED');
      client.send({
        message,
      });
      client.disconnect(true);

      return;
    }

    this.agentConnectionManagerService.registerConnection({
      projectId,
      agentId,
      socket: client,
    });

    client.send({
      message:
        'Agent connected successfully, waiting for users to interact with it.',
    });
  }

  handleDisconnect(client: Socket) {
    this.agentConnectionManagerService.removeConnectionBySid(client.id);
    this.logger.debug(`Client disconnected: SID=${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.debug(`Client ${client.id} sent message: ${payload}`);
  }
}
