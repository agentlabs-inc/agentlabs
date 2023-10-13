import { MessageFormat } from 'prisma/prisma-client';

interface BaseMessagePayload {
  text: string;
  conversationId: string;
  format: MessageFormat;
}

export type CreateUserChatMessagePayload = BaseMessagePayload;

export interface CreateAgentChatMessagePayload extends BaseMessagePayload {
  agentId: string;
}

export type CreateSystemChatMessagePayload = BaseMessagePayload;
