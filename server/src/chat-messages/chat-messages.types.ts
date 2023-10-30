import { ChatMessageSource, MessageFormat } from 'prisma/prisma-client';

export interface BaseChatMessagePayload {
  text: string;
  conversationId: string;
  format: MessageFormat;
  metadata?: any;
  type: MessageType;
  source: ChatMessageSource;
}

export type CreateUserChatMessagePayload = BaseChatMessagePayload;

export interface CreateAgentChatMessagePayload extends BaseChatMessagePayload {
  agentId: string;
}

export type CreateSystemChatMessagePayload = BaseChatMessagePayload;

export const MessageTypes = ['TEXT', 'ECHART'] as const;

export type MessageType = (typeof MessageTypes)[number];

export interface EchartMetadata {
  chartType: string;
}
