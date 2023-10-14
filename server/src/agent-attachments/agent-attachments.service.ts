import { Injectable } from '@nestjs/common';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async listByMessageId(messageId: string) {
    const messageAttachments = await this.prisma.chatMessageAttachment.findMany(
      {
        where: {
          messageId,
        },
        include: {
          attachment: true,
        },
      },
    );

    return messageAttachments;
  }

  async createMessageAttachment(payload: CreateMessageAttachmentPayload) {
    const attachment = await this.attachmentsService.createOneSync({
      filename: payload.filename,
      data: payload.data,
      mimeType: payload.mimeType,
    });
    const agentMessageAttachment =
      await this.prisma.chatMessageAttachment.create({
        data: {
          attachmentId: attachment.id,
          messageId: payload.messageId,
        },
        include: {
          attachment: true,
        },
      });

    return agentMessageAttachment;
  }
}
