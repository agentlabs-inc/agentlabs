import { Injectable } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { basename, join } from 'path';
import {
  AttachmentMetadata,
  AttachmentStorageService,
} from '../attachment-storage.service';

// Note:
// This is a very naive implementation that won't deal well with large files.

@Injectable()
export class LocalAttachmentStorageService implements AttachmentStorageService {
  private readonly attachmentBasePath = join(
    __dirname,
    '..',
    '..',
    'attachments',
  );

  private makeAttachmentPath(metadata: AttachmentMetadata): string {
    return join(
      this.attachmentBasePath,
      'projects',
      metadata.projectId,
      'agents',
      metadata.agentId,
      metadata.attachmentId,
    );
  }

  async upload(data: Buffer, metadata: AttachmentMetadata): Promise<void> {
    const filePath = this.makeAttachmentPath(metadata);
    const dir = basename(filePath);

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, data);
  }

  async download(metadata: AttachmentMetadata): Promise<Buffer> {
    const path = this.makeAttachmentPath(metadata);
    const buffer = await readFile(path);

    return buffer;
  }
}
