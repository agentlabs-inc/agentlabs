import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConversationsService } from 'src/conversations/conversations.service';
import { RequireAuthMethod } from 'src/iam/iam.decorators';
import { MemberAuthenticatedRequest } from 'src/iam/iam.types';
import { AgentMessagesService } from './agent-messages.service';

@ApiTags('agent-messages')
@Controller('agent-messages')
export class AgentMessagesController {
  constructor(
    private readonly agentMessagesService: AgentMessagesService,
    private readonly conversationsService: ConversationsService,
  ) {}

  @RequireAuthMethod('member-token')
  @Get('listByConversationId/:conversationId')
  async listByConversationId(
    @Param('conversationId') conversationId: string,
    @Req() req: MemberAuthenticatedRequest,
  ) {
    const isOwner = await this.conversationsService.isConversationOwner({
      conversationId,
      memberId: req.member.id,
    });

    if (!isOwner) {
      throw new ForbiddenException(
        'You are not allowed to access this conversation',
      );
    }

    return this.agentMessagesService.listByConversationId(conversationId);
  }
}
