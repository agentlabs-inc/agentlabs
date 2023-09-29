import { Module } from '@nestjs/common';
import { AgentChatConversationsService } from './agent-chat-conversations/agent-chat-conversations.service';
import { AgentChatMessagesService } from './agent-chat-messages/agent-chat-messages.service';

@Module({
  providers: [AgentChatConversationsService, AgentChatMessagesService],
  exports: [AgentChatConversationsService, AgentChatMessagesService],
})
export class AgentChatModule {}
