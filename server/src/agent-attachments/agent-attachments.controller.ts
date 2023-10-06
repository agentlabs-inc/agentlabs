import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
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
