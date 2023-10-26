import {
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AttachmentStorageService } from 'src/attachments/attachment-storage/attachment-storage.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { RequireAuthMethod } from 'src/iam/iam.decorators';
import { MemberAuthenticatedRequest } from 'src/iam/iam.types';
import { ChatMessagesService } from './chat-messages.service';

@ApiTags('chat-messages')
@Controller('chat-messages')
export class ChatMessagesController {
  constructor(
    private readonly agentMessagesService: ChatMessagesService,
    private readonly conversationsService: ConversationsService,
    private readonly attachmentStorageService: AttachmentStorageService,
  ) {}

  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiProduces('application/octet-stream')
  @RequireAuthMethod('member-token')
  @Get('downloadAttachment/:attachmentId')
  async downloadAttachment(
    @Param('attachmentId') attachmentId: string,
    @Req() req: MemberAuthenticatedRequest,
    @Res() res: Response,
  ) {
    const messageAttachment =
      await this.agentMessagesService.findMessageAttachment(attachmentId);

    if (!messageAttachment) {
      throw new NotFoundException('Attachment not found');
    }

    const isAuthorized =
      messageAttachment.message.conversation.memberId === req.member.id;

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not allowed to download this attachment',
      );
    }

    const data = await this.attachmentStorageService.download(attachmentId);

    res.setHeader('Content-Type', messageAttachment.attachment.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${messageAttachment.attachment.name}"`,
    );
    res.send(data);
  }

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
