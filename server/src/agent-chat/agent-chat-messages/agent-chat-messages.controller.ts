import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequireAuthMethod } from 'src/iam/iam.decorators';
import { MemberAuthenticatedRequest } from 'src/iam/iam.types';
import { AgentChatConversationsService } from '../agent-chat-conversations/agent-chat-conversations.service';
import { AgentChatMessagesService } from './agent-chat-messages.service';

@ApiTags('Agent Chat Messages')
@Controller('agent-chat-messages')
export class AgentChatMessagesController {
  constructor(
    private readonly agentChatMessagesService: AgentChatMessagesService,
    private readonly agentChatConversationsService: AgentChatConversationsService,
  ) {}

  @RequireAuthMethod('member-token')
  @Get('listByConversationId/:conversationId')
  async listByConversationId(
    @Param('conversationId') conversationId: string,
    @Req() req: MemberAuthenticatedRequest,
  ) {
    const isOwner =
      await this.agentChatConversationsService.isConversationOwner({
        conversationId,
        memberId: req.member.id,
      });

    if (!isOwner) {
      throw new ForbiddenException(
        'You are not allowed to access this conversation',
      );
    }

    return this.agentChatMessagesService.listByConversationId(conversationId);
  }
}
