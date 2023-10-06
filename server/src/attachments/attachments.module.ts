import { Module } from '@nestjs/common';
import { AttachmentStorageService } from './attachment-storage/attachment-storage.service';
import { LocalAttachmentStorageService } from './attachment-storage/local-attachment-storage/local-attachment-storage.service';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';

@Module({
  imports: [],
  providers: [
    AttachmentsService,
    {
      provide: AttachmentStorageService,
      useClass: LocalAttachmentStorageService,
    },
  ],
  exports: [AttachmentsService, AttachmentStorageService],
  controllers: [AttachmentsController],
})
export class AttachmentsModule {}
