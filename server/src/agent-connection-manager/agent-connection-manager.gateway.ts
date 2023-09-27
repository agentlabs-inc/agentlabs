import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AGENT_SOCKETIO_NAMESPACE } from './agent-connection-manager.constants';

@WebSocketGateway({ namespace: AGENT_SOCKETIO_NAMESPACE })
export class AgentConnectionManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AgentConnectionManagerGateway.name);

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.debug(`Client ${client.id} sent message: ${payload}`);
  }
}
