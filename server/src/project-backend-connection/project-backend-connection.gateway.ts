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
import { AgentsService } from 'src/agents/agents.service';
import { ChatMessagesService } from 'src/chat-messages/chat-messages.service';
import { BaseRealtimeMessageDto } from 'src/common/base-realtime-message.dto';
import { ConversationsService } from 'src/conversations/conversations.service';
import { FrontendConnectionManagerService } from 'src/frontend-connection-manager/frontend-connection-manager.service';
import { ProjectBackendConnectionManagerService } from 'src/project-backend-connection-manager/project-backend-connection-manager.service';
import { ProjectsService } from 'src/projects/projects.service';
import { SdkSecretsService } from 'src/sdk-secrets/sdk-secrets.service';
import { TelemetryService } from 'src/telemetry/telemetry.service';
import { v4 as uuid } from 'uuid';
import { AgentStreamManagerService } from './agent-stream-manager/agent-stream-manager.service';
import { ConversationMutexManager } from './conversation-mutex-manager';
import { AgentMessageDto } from './dto/agent-message.dto';
import { StreamChatMessageTokenDto } from './dto/stream-chat-message-token.dto';

@WebSocketGateway({ namespace: '/agent' })
export class ProjectBackendConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly conversationMutexManager = new ConversationMutexManager();

  constructor(
    private readonly agentConnectionManagerService: ProjectBackendConnectionManagerService,
    private readonly frontendConnectionManagerService: FrontendConnectionManagerService,
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: ChatMessagesService,
    private readonly streamManager: AgentStreamManagerService,
    private readonly sdkSecretsService: SdkSecretsService,
    private readonly agentsService: AgentsService,
    private readonly telemetryService: TelemetryService,
    private readonly projectsService: ProjectsService,
  ) {}

  private readonly logger = new Logger(ProjectBackendConnectionGateway.name);

  private parseOriginIp(client: Socket) {
    const forwardedFor = client.handshake.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0];
    }

    return client.handshake.address;
  }

  async handleConnection(client: Socket) {
    const projectId = client.handshake.headers['x-agentlabs-project-id'];
    const secret = client.handshake.headers['x-agentlabs-sdk-secret'];
    const closeWithError = (message: string) => {
      this.logger.error(message);
      client.send({
        message,
      });
      client.disconnect(true);
    };

    this.logger.debug(
      `Client connected: SID=${client.id},PROJECT=${projectId}`,
    );

    if (typeof projectId !== 'string') {
      return closeWithError(
        'Missing header: X-AgentLabs-Project-Id, closing connection',
      );
    }

    if (typeof secret !== 'string') {
      return closeWithError(
        'Missing header: X-AgentLabs-Sdk-Secret, closing connection',
      );
    }

    const project = await this.projectsService.getById(projectId);

    if (!project.ok) {
      return closeWithError('Project not found, closing connection.');
    }

    const isAuthorized = await this.sdkSecretsService.verifySdkSecret(
      projectId,
      secret,
    );

    if (!isAuthorized) {
      return closeWithError('Invalid credentials, closing connection.');
    }

    if (this.agentConnectionManagerService.hasConnection(projectId)) {
      return closeWithError(
        `Backend is already connected to project ${projectId}. Use multiple project backends are not yet supported.`,
      );
    }

    const originAddress = this.parseOriginIp(client);

    this.agentConnectionManagerService.registerConnection({
      projectId,
      socket: client,
      ip: originAddress,
    });

    this.telemetryService.trackConsoleUser({
      event: 'Project Backend Connected',
      userId: project.value.creatorId,
      properties: {
        projectId: project.value.id,
      },
    });

    client.send({
      message: `Backend connected successfully`,
    });
  }

  handleDisconnect(client: Socket) {
    this.agentConnectionManagerService.removeConnectionBySid(client.id);
    this.logger.debug(`Client disconnected: SID=${client.id}`);
  }

  @SubscribeMessage('login-request')
  async handleLoginRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: AgentMessageDto,
  ): Promise<BaseRealtimeMessageDto> {
    if (!payload.data.agentId) {
      return {
        message: 'Agent id is missing',
        timestamp: new Date().toISOString(),
        data: {},
      };
    }

    const conversation =
      await this.conversationsService.findConversationByIdWithAgent(
        payload.data.conversationId,
      );

    if (!conversation) {
      const message = `Conversation not found: ID=${payload.data.conversationId}`;

      this.logger.error(message);
      client.send({
        message,
      });

      return {
        message,
        timestamp: new Date().toISOString(),
        data: {},
        error: {
          code: 'CONVERSATION_NOT_FOUND',
          message,
        },
      };
    }

    const isProjectAgent = await this.agentsService.isProjectAgent(
      conversation.projectId,
      payload.data.agentId,
    );

    if (!isProjectAgent) {
      const message = `Message rejected: agent ${payload.data.agentId} is not an agent of project ${conversation.projectId}.`;

      client.send({
        message,
      });

      return {
        message,
        timestamp: new Date().toISOString(),
        data: {},
        error: {
          code: 'AGENT_NOT_FOUND',
          message,
        },
      };
    }

    const frontendConnection =
      this.frontendConnectionManagerService.getConnection({
        memberId: conversation.memberId,
        projectId: conversation.projectId,
      });

    if (!frontendConnection) {
      const message = `Frontend connection not found: MEMBER_ID=${conversation.memberId},PROJECT_ID=${conversation.projectId},AGENT_ID=${payload.data.agentId}`;

      this.logger.error(message);

      return {
        message,
        timestamp: new Date().toISOString(),
        data: {},
        error: {
          code: 'FRONTEND_CONNECTION_NOT_FOUND',
          message,
        },
      };
    }

    frontendConnection.socket.emit('login-request', {
      timestamp: new Date().toISOString(),
      data: {
        messageId: uuid(),
        conversationId: conversation.id,
        source: 'AGENT',
        agentId: payload.data.agentId,
        text: payload.data.text,
        format: payload.data.format,
      },
    });

    return {
      message: 'Message sent successfully',
      timestamp: new Date().toISOString(),
      data: {},
    };
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AgentMessageDto,
  ): Promise<BaseRealtimeMessageDto> {
    const error = (code: string, message: string): BaseRealtimeMessageDto => {
      this.logger.error(message);

      client.send({
        message,
      });

      return {
        message,
        timestamp: new Date().toISOString(),
        data: {},
        error: {
          code,
          message,
        },
      };
    };

    const conversation =
      await this.conversationsService.findConversationByIdWithAgent(
        payload.data.conversationId,
      );

    if (!conversation) {
      return error(
        'CONVERSATION_NOT_FOUND',
        `Conversation not found: ID=${payload.data.conversationId}`,
      );
    }

    try {
      await this.conversationMutexManager.acquire(conversation.id);

      if (payload.data.agentId) {
        const isProjectAgent = await this.agentsService.isProjectAgent(
          conversation.projectId,
          payload.data.agentId,
        );

        if (!isProjectAgent) {
          return error(
            'AGENT_NOT_FOUND',
            `Message rejected: agent ${payload.data.agentId} is not an agent of project ${conversation.projectId}.`,
          );
        }
      }

      const message = await this.messagesService.createMessage({
        conversationId: conversation.id,
        text: payload.data.text,
        format: payload.data.format,
        agentId: payload.data.agentId,
        type: payload.data.type,
        metadata: payload.data.metadata,
        source: payload.data.source,
      });

      const linkAttachmentPromises = payload.data.attachments.map(
        (attachment) =>
          this.messagesService.linkAttachment(message.id, attachment.id),
      );

      const messageAttachments = await Promise.all(linkAttachmentPromises);

      const frontendConnection =
        this.frontendConnectionManagerService.getConnection({
          memberId: conversation.memberId,
          projectId: conversation.projectId,
        });

      if (!frontendConnection) {
        return error(
          'FRONTEND_CONNECTION_NOT_FOUND',
          `Frontend connection not found: MEMBER_ID=${conversation.memberId},PROJECT_ID=${conversation.projectId},AGENT_ID=${payload.data.agentId}`,
        );
      }

      frontendConnection.socket.emit('chat-message', {
        timestamp: new Date().toISOString(),
        data: {
          conversationId: conversation.id,
          text: payload.data.text,
          format: payload.data.format,
          source: payload.data.source,
          messageId: message.id,
          agentId: payload.data.agentId,
          attachments: messageAttachments,
          type: payload.data.type,
          metadata: payload.data.metadata,
        },
      });

      return {
        message: 'Message sent successfully',
        timestamp: new Date().toISOString(),
        data: {},
      };
    } finally {
      this.conversationMutexManager.release(conversation.id);
    }
  }

  @SubscribeMessage('stream-chat-message-start')
  async handleStreamChatMessageStart(
    @MessageBody() payload: StreamChatMessageTokenDto,
  ) {
    await this.streamManager.start({
      messageId: payload.data.messageId,
      conversationId: payload.data.conversationId,
      token: payload.data.text,
      format: payload.data.format,
      agentId: payload.data.agentId,
    });
  }

  @SubscribeMessage('stream-chat-message-token')
  async handleStreamChatMessageToken(
    @MessageBody() payload: StreamChatMessageTokenDto,
  ) {
    await this.streamManager.handle({
      messageId: payload.data.messageId,
      conversationId: payload.data.conversationId,
      token: payload.data.text,
      format: payload.data.format,
      agentId: payload.data.agentId,
    });
  }

  @SubscribeMessage('stream-chat-message-end')
  async handleStreamChatMessageEnd(@MessageBody() payload: any) {
    await this.streamManager.end(payload.data.messageId);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.logger.debug(`Client ${client.id} sent message: ${payload}`);
  }
}
