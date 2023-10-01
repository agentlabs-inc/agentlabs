import { Module } from '@nestjs/common';
import { AgentAttachmentsController } from './agent-attachments.controller';
import { AgentAttachmentsService } from './agent-attachments.service';
import { AttachmentStorageService } from './attachment-storage/attachment-storage.service';
import { LocalAttachmentStorageService } from './attachment-storage/local-attachment-storage/local-attachment-storage.service';

@Module({
  providers: [
    AgentAttachmentsService,
    {
      provide: AttachmentStorageService,
      useClass: LocalAttachmentStorageService,
    },
    LocalAttachmentStorageService,
  ],
  controllers: [AgentAttachmentsController],
})
export class AgentAttachmentsModule {}
