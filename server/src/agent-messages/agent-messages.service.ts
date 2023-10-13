import { Injectable } from '@nestjs/common';
import { AgentMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentMessagePayload } from './agent-messages.types';

@Injectable()
export class AgentMessagesService {
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
    payload: CreateAgentMessagePayload,
  ): Promise<AgentMessage> {
    const message = await this.prisma.agentMessage.create({
      data: {
        text: payload.text,
        source: payload.source,
        conversationId: payload.conversationId,
        format: payload.format,
      },
    });

    return message;
  }
}
