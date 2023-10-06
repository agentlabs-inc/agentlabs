import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AttachmentStorageService } from './attachment-storage/attachment-storage.service';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly storageService: AttachmentStorageService,
  ) {}

  @Get('viewById/:id')
  async serveById(@Param('id') id: string, @Res() res: Response) {
    const attachment = await this.attachmentsService.findById(id);

    if (!attachment || !attachment.isPublic) {
      throw new NotFoundException('Attachment not found.');
    }

    const data = await this.storageService.download(attachment.id);

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${attachment.name}"`, // ignored by most browsers
    );
    res.setHeader('Content-Length', data.length);
    res.send(data);
  }

  @Get('downloadById/:id')
  async downloadById(@Param('id') id: string, @Res() res: Response) {
    const attachment = await this.attachmentsService.findById(id);

    if (!attachment || !attachment.isPublic) {
      throw new NotFoundException('Attachment not found.');
    }

    const data = await this.storageService.download(attachment.id);

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${attachment.name}"`, // ignored by most browsers
    );
    res.setHeader('Content-Length', data.length);
    res.send(data);
  }
}
