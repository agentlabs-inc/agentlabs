import { Injectable } from '@nestjs/common';
import { AgentMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentChatMessagePayload } from './agent-chat-messages.types';

@Injectable()
export class AgentChatMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByConversationId(conversationId: string): Promise<AgentMessage[]> {
    const messages = await this.prisma.agentMessage.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  }

  async createMessage(
    payload: CreateAgentChatMessagePayload,
  ): Promise<AgentMessage> {
    const message = await this.prisma.agentMessage.create({
      data: {
        text: payload.text,
        source: payload.source,
        conversationId: payload.conversationId,
      },
    });

    return message;
  }
}
