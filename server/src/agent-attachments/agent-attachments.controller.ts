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
import { Response } from 'express';
import { AgentAttachmentsService } from './agent-attachments.service';
import { CreateMessageAttachmentSyncDto } from './dto/create-message-attachment-sync.dto';
import { GetAttachmentDataSyncDto } from './dto/get-attachment-data-sync.dto';

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
  async getDataById(
    @Param('attachmentId') attachmentId: string,
    @Query() { agentId, projectId }: GetAttachmentDataSyncDto,
    @Res() res: Response,
  ) {
    const attachment = await this.agentAttachmentsService.getById(attachmentId);
    if (!attachment) {
      throw new NotFoundException(
        `Attachment with id ${attachmentId} not found.`,
      );
    }

    const data = await this.agentAttachmentsService.getAttachmentData(
      projectId,
      agentId,
      attachmentId,
    );

    res.set('Content-Type', attachment.mimeType);
    res.set('Content-Disposition', `attachment; filename=${attachment.name}`);
    res.send(data);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('createSync')
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
        filename: file.originalname,
        mimeType: file.mimetype,
        projectId,
        messageId,
        agentId,
      });

    return attachment;
  }
}
