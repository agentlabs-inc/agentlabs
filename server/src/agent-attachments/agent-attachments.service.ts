import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttachmentStorageService } from './attachment-storage/attachment-storage.service';

export interface CreateMessageAttachmentPayload {
  projectId: string;
  agentId: string;
  data: Buffer;
  mimeType: string;
  messageId: string;
  filename: string;
}

@Injectable()
export class AgentAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attachmentStorageService: AttachmentStorageService,
  ) {}

  private computeChecksum(data: Buffer) {
    return createHash('sha256').update(data).digest('hex');
  }

  async createMessageAttachment(payload: CreateMessageAttachmentPayload) {
    const checksum = this.computeChecksum(payload.data);
    const attachment = await this.prisma.agentAttachment.create({
      data: {
        name: payload.data.toString(),
        driver: 'LOCAL_FILE_SYSTEM',
        mimeType: payload.mimeType,
        checksumSha256: checksum,
        messages: {
          connect: {
            id: payload.messageId,
          },
        },
      },
    });

    await this.attachmentStorageService.upload(payload.data, {
      checksumSha256: checksum,
      mimeType: payload.mimeType,
      attachmentId: attachment.id,
      agentId: payload.agentId,
      projectId: payload.projectId,
      filename: payload.filename,
    });

    return attachment;
  }
}
