import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentChatMessagesService } from './agent-chat-messages.service';

@ApiTags('Agent Chat Messages')
@Controller('agent-chat-messages')
export class AgentChatMessagesController {
  constructor(
    private readonly agentChatMessagesService: AgentChatMessagesService,
  ) {}

  @Get('listByConversationId/:conversationId')
  listByConversationId(@Param('conversationId') conversationId: string) {
    return this.agentChatMessagesService.listByConversationId(conversationId);
  }
}
