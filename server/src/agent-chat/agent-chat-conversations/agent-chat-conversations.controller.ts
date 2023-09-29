import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { AgentChatConversationsService } from './agent-chat-conversations.service';

@Controller('agent-chat-conversations')
export class AgentChatConversationsController {
  constructor(
    private readonly conversationsService: AgentChatConversationsService,
  ) {}

  @Get('')
  async getAllConversations() {
    return await this.conversationsService.findAllConversations();
  }

  // TODO: only return the N most recent messages for the specified conversation
  @Get(':conversationId')
  async getConversationById(@Param('conversationId') conversationId: string) {
    const conversation =
      await this.conversationsService.findConversationByIdWithMessages(
        conversationId,
      );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }
}
