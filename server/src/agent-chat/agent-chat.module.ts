import { Module } from '@nestjs/common';
import { AgentChatConversationsService } from './agent-chat-conversations/agent-chat-conversations.service';
import { AgentChatMessagesService } from './agent-chat-messages/agent-chat-messages.service';
import { AgentChatConversationsController } from './agent-chat-conversations/agent-chat-conversations.controller';
import { AgentChatMessagesController } from './agent-chat-messages/agent-chat-messages.controller';

@Module({
  providers: [AgentChatConversationsService, AgentChatMessagesService],
  exports: [AgentChatConversationsService, AgentChatMessagesService],
  controllers: [AgentChatConversationsController, AgentChatMessagesController],
})
export class AgentChatModule {}
