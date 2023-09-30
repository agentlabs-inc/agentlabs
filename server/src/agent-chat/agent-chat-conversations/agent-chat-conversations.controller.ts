import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentChatConversationsService } from './agent-chat-conversations.service';
import { GetAllConversationsDto } from './dto/get-all-conversations.dto';

@ApiTags('Agent Chat Conversations')
@Controller('conversations')
export class AgentChatConversationsController {
  constructor(
    private readonly conversationsService: AgentChatConversationsService,
  ) {}

  @Get('getAll')
  async getAllConversations(
    @Query() { memberId, agentId }: GetAllConversationsDto,
  ) {
    const conversations = await this.conversationsService.findAllConversations({
      agentId,
      memberId,
    });

    return conversations;
  }

  // TODO: only return the N most recent messages for the specified conversation
  @Get('getById/:conversationId')
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
