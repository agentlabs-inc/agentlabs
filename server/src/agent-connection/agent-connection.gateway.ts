import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AgentConnectionManagerService } from 'src/agent-connection-manager/agent-connection-manager.service';
import { FrontendConnectionManagerService } from 'src/frontend-connection-manager/frontend-connection-manager.service';

@WebSocketGateway({ namespace: '/agent' })
export class AgentConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly agentConnectionManagerService: AgentConnectionManagerService,
    private readonly frontendConnectionManagerService: FrontendConnectionManagerService,
  ) {}

  private readonly logger = new Logger(AgentConnectionGateway.name);

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
      message: `Agent ${agentId} connected successfully`,
    });
  }

  handleDisconnect(client: Socket) {
    this.agentConnectionManagerService.removeConnectionBySid(client.id);
    this.logger.debug(`Client disconnected: SID=${client.id}`);
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const senderSid = payload.senderSid;
    const senderConnection =
      this.frontendConnectionManagerService.getConnectionBySid(senderSid);

    if (!senderConnection) {
      this.logger.error(`Sender connection not found: SID=${senderSid}`);
      return {
        error: {
          code: 'SENDER_NOT_FOUND',
          message: 'Sender connection not found',
        },
      };
    }

    senderConnection.socket.emit('chat-message', payload);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.debug(`Client ${client.id} sent message: ${payload}`);
  }
}
