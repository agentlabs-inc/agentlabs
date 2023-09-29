import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AgentConnectionManagerService } from 'src/agent-connection-manager/agent-connection-manager.service';
import { FrontendConnectionManagerService } from 'src/frontend-connection-manager/frontend-connection-manager.service';

@WebSocketGateway({ namespace: '/frontend' })
export class FrontendConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(FrontendConnectionGateway.name);

  constructor(
    private readonly frontendConnectionManagerService: FrontendConnectionManagerService,
    private readonly agentConnectionManagerService: AgentConnectionManagerService,
  ) {}

  handleConnection(client: Socket) {
    const projectId = client.handshake.headers['x-agentlabs-project-id'];
    const agentId = client.handshake.headers['x-agentlabs-agent-id'];
    const userId = client.handshake.headers['x-agentlabs-user-id'];

    this.logger.debug(
      `Frontend client connected: project=${projectId} agent=${agentId} user=${userId}`,
    );

    if (typeof userId !== 'string') {
      const message =
        'Failed to identify frontend client: Missing user ID. Expected header: x-agentlabs-user-id';

      this.logger.error(message);
      client.send({
        message,
      });
      client.disconnect(true);

      return;
    }

    if (typeof projectId !== 'string') {
      const message =
        'Failed to identify frontend client: Missing project ID. Expected header: x-agentlabs-project-id';

      this.logger.error(message);
      client.send({
        message,
      });
      client.disconnect(true);

      return;
    }

    if (typeof agentId !== 'string') {
      const message =
        'Failed to identify frontend client: Missing agent ID. Expected header: x-agentlabs-agent-id';

      this.logger.error(message);
      client.send({
        message,
      });
      client.disconnect(true);

      return;
    }

    this.frontendConnectionManagerService.registerConnection({
      socket: client,
      agentId,
      projectId,
      userId,
    });

    client.send('Connected to server, waiting for messages...');
  }

  handleDisconnect(client: Socket) {
    this.frontendConnectionManagerService.removeConnectionBySid(client.id);
    this.logger.debug(`Frontend client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(@ConnectedSocket() client: Socket, payload: any) {
    const frontendConnection =
      this.frontendConnectionManagerService.getConnectionBySid(client.id);

    if (!frontendConnection) {
      return {
        error: 'Failed to send message: Unknown connection',
      };
    }

    const agentConnection = this.agentConnectionManagerService.getConnection(
      frontendConnection.projectId,
      frontendConnection.agentId,
    );

    if (!agentConnection) {
      return {
        error: 'Failed to contact agent: not connected.',
      };
    }

    agentConnection.socket.emit('chat-message', {
      data: payload,
      frontendClientSid: client.id,
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
