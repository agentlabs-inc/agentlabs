import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequireAuthMethod } from 'src/iam/iam.decorators';
import { MemberAuthenticatedRequest } from 'src/iam/iam.types';
import { AgentChatConversationsService } from './agent-chat-conversations.service';
import { GetAllConversationsDto } from './dto/get-all-conversations.dto';

@ApiTags('Agent Chat Conversations')
@Controller('conversations')
export class AgentChatConversationsController {
  constructor(
    private readonly conversationsService: AgentChatConversationsService,
  ) {}

  @RequireAuthMethod('member-token')
  @Get('getAll')
  async getAllConversations(
    @Query() { projectId }: GetAllConversationsDto,
    @Req() req: MemberAuthenticatedRequest,
  ) {
    const conversations = await this.conversationsService.findAllConversations({
      projectId,
      memberId: req.member.id,
    });

    return conversations;
  }
}
