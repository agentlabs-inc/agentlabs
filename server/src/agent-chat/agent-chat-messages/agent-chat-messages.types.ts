import { AgentMessageSource, MessageFormat } from 'prisma/prisma-client';

export interface CreateAgentChatMessagePayload {
  text: string;
  source: AgentMessageSource;
  conversationId: string;
  format: MessageFormat;
}
