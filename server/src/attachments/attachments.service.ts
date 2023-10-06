import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttachmentPayload } from './attachments.types';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private computeChecksum(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Designed to handle small attachments that can be held in the passed buffer.
   * Attachments of more consequent size would have to be handled through some kind of
   * streaming mechanism, which AgentLabs does not currently support.
   */
  async createOneSync(payload: CreateAttachmentPayload) {
    const checksum = this.computeChecksum(payload.data);
    const attachment = await this.prisma.attachment.create({
      data: {
        driver: 'LOCAL_FILE_SYSTEM',
        name: payload.filename,
        mimeType: payload.mimeType,
        checksumSha256: checksum,
      },
    });

    return attachment;
  }
}
