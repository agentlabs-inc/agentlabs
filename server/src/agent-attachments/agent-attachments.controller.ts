import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AgentAttachmentsService } from './agent-attachments.service';
import { CreateMessageAttachmentSyncDto } from './dto/create-message-attachment-sync.dto';

@Controller('agent-attachments')
export class AgentAttachmentsController {
  constructor(
    private readonly agentAttachmentsService: AgentAttachmentsService,
  ) {}

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
