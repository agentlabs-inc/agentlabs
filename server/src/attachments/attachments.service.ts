import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { getType } from 'mime';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttachmentStorageService } from './attachment-storage/attachment-storage.service';
import { CreateAttachmentPayload } from './attachments.types';

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger(AttachmentsService.name);
  private readonly DEFAULT_ATTACHMENT_MIME_TYPE = 'application/octet-stream';

  constructor(
    private readonly storageService: AttachmentStorageService,
    private readonly prisma: PrismaService,
  ) {}

  private computeChecksum(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  inferMimeTypeFromFilename(filename: string): string {
    return getType(filename) ?? this.DEFAULT_ATTACHMENT_MIME_TYPE;
  }

  isDefaultMimeType(mimeType: string): boolean {
    return mimeType === this.DEFAULT_ATTACHMENT_MIME_TYPE;
  }

  async findById(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: {
        id: id,
      },
    });

    return attachment;
  }

  /**
   * Designed to handle small attachments that can be held in the passed buffer.
   * Attachments of more consequent size would have to be handled through some kind of
   * streaming mechanism, which AgentLabs does not currently support.
   */
  async createOneSync(payload: CreateAttachmentPayload) {
    const checksum = this.computeChecksum(payload.data);

    this.logger.debug(`Creating attachment with checksum ${checksum}.`);

    const attachment = await this.prisma.attachment.create({
      data: {
        driver: 'LOCAL_FILE_SYSTEM',
        name: payload.filename,
        mimeType: payload.mimeType,
        checksumSha256: checksum,
        isPublic: payload.isPublic,
        projectId: payload.projectId,
        sizeBytes: payload.size,
      },
    });

    this.logger.debug(`Uploading attachment with checksum ${checksum}.`);

    await this.storageService.upload(payload.data, {
      checksumSha256: checksum,
      attachmentId: attachment.id,
      mimeType: payload.mimeType,
      filename: payload.filename,
    });

    this.logger.debug(`Attachment with checksum ${checksum} created.`);

    return attachment;
  }
}
