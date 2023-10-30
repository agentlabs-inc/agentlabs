import { Injectable } from '@nestjs/common';
import { ChatMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TelemetryService } from 'src/telemetry/telemetry.service';
import { BaseChatMessagePayload } from './chat-messages.types';

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetryService: TelemetryService,
  ) {}

  async findMessageAttachment(attachmentId: string) {
    return this.prisma.chatMessageAttachment.findUnique({
      where: {
        attachmentId,
      },
      include: {
        message: {
          include: {
            conversation: true,
          },
        },
        attachment: true,
      },
    });
  }

  async listByConversationId(conversationId: string): Promise<ChatMessage[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        attachments: {
          include: {
            attachment: true,
          },
        },
      },
    });

    return messages;
  }

  async linkAttachment(messageId: string, attachmentId: string) {
    return this.prisma.chatMessageAttachment.create({
      data: {
        messageId,
        attachmentId,
      },
      include: {
        attachment: true,
      },
    });
  }

  async createMessage(payload: BaseChatMessagePayload) {
    const message = await this.prisma.chatMessage.create({
      data: {
        text: payload.text,
        source: payload.source,
        conversationId: payload.conversationId,
        format: payload.format,
        type: payload.type,
        metadata: payload.metadata,
      },
      include: {
        conversation: {
          include: {
            project: true,
          },
        },
      },
    });

    this.telemetryService.trackConsoleUser({
      userId: message.conversation.project.creatorId,
      event: 'Message Sent',
      properties: {
        projectId: message.conversation.projectId,
        conversationId: message.conversationId,
        messageId: message.id,
        messageType: message.type,
        messageSource: message.source,
      },
    });

    return message;
  }

  async createUserMessage(
    payload: Omit<BaseChatMessagePayload, 'source'>,
  ): Promise<ChatMessage> {
    return this.createMessage({ ...payload, source: 'USER' });
  }

  async createAgentMessage(payload: Omit<BaseChatMessagePayload, 'source'>) {
    return this.createMessage({ ...payload, source: 'AGENT' });
  }

  async createSystemMessage(payload: Omit<BaseChatMessagePayload, 'source'>) {
    return this.createMessage({ ...payload, source: 'SYSTEM' });
  }
}
