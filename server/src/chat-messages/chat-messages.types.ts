import { MessageFormat } from 'prisma/prisma-client';

interface BaseMessagePayload {
  text: string;
  conversationId: string;
  format: MessageFormat;
  metadata?: any;
  type: MessageType;
}

export type CreateUserChatMessagePayload = BaseMessagePayload;

export interface CreateAgentChatMessagePayload extends BaseMessagePayload {
  agentId: string;
}

export type CreateSystemChatMessagePayload = BaseMessagePayload;

export const MessageTypes = ['TEXT', 'ECHART'] as const;

export type MessageType = (typeof MessageTypes)[number];

export interface EchartMetadata {
  chartType: string;
}
