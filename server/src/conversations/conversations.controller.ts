import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequireAuthMethod } from 'src/iam/iam.decorators';
import { MemberAuthenticatedRequest } from 'src/iam/iam.types';
import { ConversationsService } from './conversations.service';
import { GetAllConversationsDto } from './dto/get-all-conversations.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

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
