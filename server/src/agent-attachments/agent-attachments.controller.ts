import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AgentAttachmentsService } from './agent-attachments.service';
import { CreateMessageAttachmentSyncDto } from './dto/create-message-attachment-sync.dto';

@ApiTags('Agent Attachments')
@Controller('agent-attachments')
export class AgentAttachmentsController {
  constructor(
    private readonly agentAttachmentsService: AgentAttachmentsService,
  ) {}

  @Get('listByMessageId/:messageId')
  async listByMessageId(@Param('messageId') messageId: string) {
    return this.agentAttachmentsService.listByMessageId(messageId);
  }

  @Get('getById/:attachmentId')
  async getById(@Param('attachmentId') attachmentId: string) {
    const attachment = this.agentAttachmentsService.getById(attachmentId);

    if (!attachment) {
      throw new NotFoundException(
        `Attachment with id ${attachmentId} not found.`,
      );
    }

    return attachment;
  }

  @Get('getById/:attachmentId/data')
  async getAttachmentDataById(
    @Param('attachmentId') attachmentId: string,
    @Res() res: Response,
  ) {
    const attachment = await this.agentAttachmentsService.getById(attachmentId);

    if (!attachment) {
      throw new NotFoundException(
        `Attachment with id ${attachmentId} not found.`,
      );
    }

    const data = await this.agentAttachmentsService.getAttachmentData(
      attachmentId,
    );

    res.set('Content-Type', attachment.mimeType);
    res.set('Content-Disposition', `attachment; filename=${attachment.name}`);
    res.send(data);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('createMessageAttachmentSync')
  async createSync(
    @UploadedFile() file: Express.Multer.File,
    @Query() { projectId, agentId, messageId }: CreateMessageAttachmentSyncDto,
  ) {
    if (!file) {
      throw new BadRequestException('Expected file, got nothing.');
    }

    const attachment =
      await this.agentAttachmentsService.createMessageAttachment({
        data: file.buffer,
        filename: file.filename,
        mimeType: file.mimetype,
        projectId,
        messageId,
        agentId,
      });

    return attachment;
  }
}
