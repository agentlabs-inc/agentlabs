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
import { AgentChatConversationsService } from 'src/agent-chat/agent-chat-conversations/agent-chat-conversations.service';
import { AgentChatMessagesService } from 'src/agent-chat/agent-chat-messages/agent-chat-messages.service';
import { AgentConnectionManagerService } from 'src/agent-connection-manager/agent-connection-manager.service';
import { AgentsService } from 'src/agents/agents.service';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';
import { TutorialMessageFactory } from 'src/common/tutorial-message-factory';
import { FrontendConnectionManagerService } from 'src/frontend-connection-manager/frontend-connection-manager.service';
import { MembersService } from 'src/members/members.service';
import { FrontendChatMessageDto } from './dto/frontend-chat-message.dto';

@WebSocketGateway({ namespace: '/frontend' })
export class FrontendConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(FrontendConnectionGateway.name);
  private readonly projectIdHeader = 'x-agentlabs-project-id';
  private readonly agentIdHeader = 'x-agentlabs-agent-id';

  constructor(
    private readonly frontendConnectionManagerService: FrontendConnectionManagerService,
    private readonly agentConnectionManagerService: AgentConnectionManagerService,
    private readonly conversationsService: AgentChatConversationsService,
    private readonly messagesService: AgentChatMessagesService,
    private readonly agentsService: AgentsService,
    private readonly membersService: MembersService,
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
    const agentId = client.handshake.headers[this.agentIdHeader];
    const authorization = client.handshake.headers['authorization'];

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

    if (typeof agentId !== 'string') {
      return closeWithError(`Missing header: ${this.agentIdHeader}`);
    }

    this.logger.debug(
      `Frontend client connected: project=${projectId} agent=${agentId} user=${memberId}`,
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

    const agent = await this.agentsService.findProjectAgent(projectId, agentId);

    if (!agent) {
      return closeWithError(`Agent not found: ${agentId}`);
    }

    this.frontendConnectionManagerService.registerConnection({
      socket: client,
      agentId,
      projectId,
      memberId: memberId,
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
        agentId: frontendConnection.agentId,
        memberId: frontendConnection.memberId,
      });
    }

    const message = await this.messagesService.createMessage({
      source: 'USER',
      text: payload.data.text,
      conversationId: conversation.id,
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
      frontendConnection.agentId,
    );

    if (!agentConnection) {
      const connectionCount = await this.agentsService.getConnectionCount(
        frontendConnection.agentId,
      );

      let text = '';

      if (connectionCount > 0) {
        text = 'Agent is offline. Please ask the platform owner for help.';
      } else {
        text = TutorialMessageFactory.createMessage(
          frontendConnection.projectId,
          frontendConnection.agentId,
        );
      }

      // TODO: if the agent was never connected, assume it is the platform owner testing his app out.
      // Send  a link to the documentation on how to connect an agent.

      await this.messagesService.createMessage({
        conversationId: conversation.id,
        source: 'SYSTEM',
        text,
      });

      const payload: BaseRealtimeMessageDto = {
        timestamp: new Date().toISOString(),
        data: {
          text,
          conversationId: conversation.id,
          source: 'SYSTEM',
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
        agentId: frontendConnection.agentId,
        messageId: message.id,
        memberId: frontendConnection.memberId,
      },
    });

    return clientPayload;
  }
}
