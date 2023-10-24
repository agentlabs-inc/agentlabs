import { Injectable } from '@nestjs/common';
import { ChatMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAgentChatMessagePayload,
  CreateSystemChatMessagePayload,
  CreateUserChatMessagePayload,
} from './chat-messages.types';

@Injectable()
export class ChatMessagesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createUserMessage(
    payload: CreateUserChatMessagePayload,
  ): Promise<ChatMessage> {
    const message = await this.prisma.chatMessage.create({
      data: {
        text: payload.text,
        source: 'USER',
        conversationId: payload.conversationId,
        format: payload.format,
      },
    });

    return message;
  }

  async createAgentMessage(payload: CreateAgentChatMessagePayload) {
    const message = await this.prisma.chatMessage.create({
      data: {
        text: payload.text,
        source: 'AGENT',
        conversationId: payload.conversationId,
        format: payload.format,
        agentId: payload.agentId,
      },
    });

    return message;
  }

  async createSystemMessage(payload: CreateSystemChatMessagePayload) {
    const message = await this.prisma.chatMessage.create({
      data: {
        text: payload.text,
        source: 'SYSTEM',
        conversationId: payload.conversationId,
        format: payload.format,
      },
    });

    return message;
  }
}
