import { Injectable, Logger } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { readFile, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import {
  AttachmentMetadata,
  AttachmentStorageService,
} from '../attachment-storage.service';

// Note:
// This is a very naive implementation that won't deal well with large files.

@Injectable()
export class LocalAttachmentStorageService implements AttachmentStorageService {
  private readonly logger = new Logger(LocalAttachmentStorageService.name);

  private readonly attachmentBasePath = join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'attachments',
  );

  constructor() {
    this.logger.debug(`Initializing local attachment storage service`);
    mkdirSync(this.attachmentBasePath, { recursive: true });
  }

  private makeAttachmentPath(attachmentId: string) {
    return join(this.attachmentBasePath, attachmentId);
  }

  async delete(attachmentId: string): Promise<void> {
    this.logger.debug(`Deleting attachment ${attachmentId}`);
    await unlink(attachmentId);
    this.logger.debug(`Deleted attachment ${attachmentId}`);
  }

  async upload(data: Buffer, metadata: AttachmentMetadata): Promise<void> {
    this.logger.debug(`Uploading attachment ${metadata.attachmentId}`);
    const filePath = this.makeAttachmentPath(metadata.attachmentId);

    await writeFile(filePath, data);
    this.logger.debug(`Uploaded attachment ${metadata.attachmentId}`);
  }

  async download(attachmentId: string): Promise<Buffer> {
    const path = this.makeAttachmentPath(attachmentId);
    const buffer = await readFile(path);

    return buffer;
  }
}
