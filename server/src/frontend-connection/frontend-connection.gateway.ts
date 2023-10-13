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
import { AgentMessagesService } from 'src/agent-messages/agent-messages.service';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';
import { TutorialMessageFactory } from 'src/common/tutorial-message-factory';
import { ConversationsService } from 'src/conversations/conversations.service';
import { FrontendConnectionManagerService } from 'src/frontend-connection-manager/frontend-connection-manager.service';
import { MembersService } from 'src/members/members.service';
import { ProjectBackendConnectionManagerService } from 'src/project-backend-connection-manager/project-backend-connection-manager.service';
import { ProjectsService } from 'src/projects/projects.service';
import { FrontendChatMessageDto } from './dto/frontend-chat-message.dto';

@WebSocketGateway({ namespace: '/frontend' })
export class FrontendConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(FrontendConnectionGateway.name);
  private readonly projectIdHeader = 'x-agentlabs-project-id';

  constructor(
    private readonly frontendConnectionManagerService: FrontendConnectionManagerService,
    private readonly agentConnectionManagerService: ProjectBackendConnectionManagerService,
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: AgentMessagesService,
    private readonly membersService: MembersService,
    private readonly projectsService: ProjectsService,
  ) {}

  extractToken(authorization: string) {
    return authorization.split(' ')[1];
  }

  async handleConnection(client: Socket) {
    const closeWithError = (message: string) => {
      this.logger.error(message);
      client.send({
        message,
      });
      client.disconnect(true);
    };

    const projectId = client.handshake.headers[this.projectIdHeader];
    const authorization = client.handshake.headers['authorization'];
    const host = client.handshake.headers['host'];

    if (!authorization) {
      return closeWithError('Missing header: authorization');
    }

    const token = this.extractToken(authorization);
    let memberId: null | string = null;

    try {
      const payload = await this.membersService.verifyAccessToken(token);

      if (!payload.sub) {
        return closeWithError('Missing payload.sub');
      }

      memberId = payload.sub;
    } catch (e) {
      return closeWithError(`Failed to verify access token: ${e.message}`);
    }

    if (typeof projectId !== 'string') {
      return closeWithError(`Missing header: ${this.projectIdHeader}`);
    }

    if (typeof host !== 'string') {
      return closeWithError(`Missing header: host`);
    }

    this.logger.debug(
      `Frontend client connected: project=${projectId} user=${memberId}`,
    );

    const result = await this.membersService.verifyIfProjectMember({
      projectId,
      memberId,
    });

    if (!result.ok) {
      return closeWithError(
        `Failed to identify frontend client: ${result.error}`,
      );
    }

    this.frontendConnectionManagerService.registerConnection({
      socket: client,
      projectId,
      memberId: memberId,
      host,
    });

    client.send('Connected to server, waiting for messages...');
  }

  handleDisconnect(client: Socket) {
    this.frontendConnectionManagerService.removeConnectionBySid(client.id);
    this.logger.debug(`Frontend client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FrontendChatMessageDto,
  ): Promise<BaseRealtimeMessageDto> {
    const frontendConnection =
      this.frontendConnectionManagerService.getConnectionBySid(client.id);

    if (!frontendConnection) {
      this.logger.error(`Frontend client not connected: ${client.id}`);
      return {
        message: 'Not connected to server',
        data: {},
        timestamp: new Date().toISOString(),
        error: {
          code: 'NOT_CONNECTED',
          message: 'Not connected to server',
        },
      };
    }

    let conversation = await this.conversationsService.findConversationById(
      payload.data.conversationId,
    );

    if (!conversation) {
      conversation = await this.conversationsService.createConversation({
        id: payload.data.conversationId,
        projectId: frontendConnection.projectId,
        memberId: frontendConnection.memberId,
      });
    }

    const message = await this.messagesService.createUserMessage({
      text: payload.data.text,
      conversationId: conversation.id,
      format: 'PLAIN_TEXT',
    });

    const clientPayload: BaseRealtimeMessageDto = {
      timestamp: new Date().toISOString(),
      data: {
        text: message.text,
        conversationId: conversation.id,
        source: 'USER',
      },
      message: 'Message sent',
    };

    const agentConnection = this.agentConnectionManagerService.getConnection(
      frontendConnection.projectId,
    );

    if (!agentConnection) {
      const connectionCount =
        await this.projectsService.getBackendConnectionLogCountByProjectId(
          frontendConnection.projectId,
        );

      let text = '';

      if (connectionCount > 0) {
        text = 'Project is offline. Please ask the platform owner for help.';
      } else {
        text = TutorialMessageFactory.createMessage(
          frontendConnection.projectId,
          frontendConnection.host,
        );
      }

      await this.messagesService.createSystemMessage({
        conversationId: conversation.id,
        text,
        format: 'MARKDOWN',
      });

      const payload: BaseRealtimeMessageDto = {
        timestamp: new Date().toISOString(),
        data: {
          text,
          conversationId: conversation.id,
          source: 'SYSTEM',
          messageId: message.id,
          format: 'MARKDOWN',
        },
        message: 'Agent is offline',
      };

      frontendConnection.socket.emit('chat-message', payload);

      return clientPayload;
    }

    agentConnection.socket.emit('chat-message', {
      data: {
        text: payload.data.text,
        conversationId: conversation.id,
        messageId: message.id,
        memberId: frontendConnection.memberId,
      },
    });

    return clientPayload;
  }
}
