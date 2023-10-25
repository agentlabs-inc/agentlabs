import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RequireAuthMethod } from 'src/iam/iam.decorators';
import { ServerSdkAuthenticatedRequest } from 'src/iam/iam.types';
import { AttachmentStorageService } from './attachment-storage/attachment-storage.service';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  private readonly UPLOAD_LIMIT = 1024 * 1024 * 10;

  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly storageService: AttachmentStorageService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @RequireAuthMethod('server-sdk')
  @Post('uploadSync')
  async createAttachmentSync(
    @Req() req: ServerSdkAuthenticatedRequest,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Expected a field named "file"');
    }

    if (file.size > this.UPLOAD_LIMIT) {
      throw new BadRequestException(
        'File is too large, current max is set to 50MB',
      );
    }

    const projectId = req.sdkUser.projectId;

    const mimeType = this.attachmentsService.isDefaultMimeType(file.mimetype)
      ? this.attachmentsService.inferMimeTypeFromFilename(file.originalname)
      : file.mimetype;

    return this.attachmentsService.createOneSync({
      isPublic: true,
      mimeType,
      filename: file.originalname,
      data: file.buffer,
      projectId,
      size: file.size,
    });
  }

  @Get('viewById/:id')
  async serveById(@Param('id') id: string, @Res() res: Response) {
    const attachment = await this.attachmentsService.findById(id);

    if (!attachment || !attachment.isPublic) {
      throw new NotFoundException('Attachment not found.');
    }

    const data = await this.storageService.download(attachment.id);

    console.log('attachment.mimeType', attachment.mimeType);

    res.setHeader(
      'Content-Disposition',
      `inline; filename="${attachment.name}"`,
    );

    res.setHeader('Content-Type', attachment.mimeType);
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
