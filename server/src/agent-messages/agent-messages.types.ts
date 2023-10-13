import { AgentMessageSource, MessageFormat } from 'prisma/prisma-client';

export interface CreateAgentMessagePayload {
  text: string;
  source: AgentMessageSource;
  conversationId: string;
  format: MessageFormat;
}
