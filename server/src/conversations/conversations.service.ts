import { Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateConversationPayload,
  FindAllConversationsPayload,
} from './conversations.types';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllConversations({
    memberId,
    projectId,
  }: FindAllConversationsPayload): Promise<Conversation[]> {
    return await this.prisma.conversation.findMany({
      where: {
        projectId,
        memberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async isConversationOwner({
    memberId,
    conversationId,
  }: {
    memberId: string;
    conversationId: string;
  }) {
    const count = await this.prisma.conversation.count({
      where: {
        id: conversationId,
        memberId,
      },
    });

    return count > 0;
  }

  async createConversation(
    payload: CreateConversationPayload,
  ): Promise<Conversation> {
    const conversation = await this.prisma.conversation.create({
      data: {
        memberId: payload.memberId,
        projectId: payload.projectId,
        id: payload.id,
      },
    });

    return conversation;
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id,
      },
    });

    return conversation;
  }

  async findConversationByIdWithMessages(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });

    return conversation;
  }

  async findConversationByIdWithAgent(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        // TODO: no more agent, previously: agent: true,
      },
    });

    return conversation;
  }
}
