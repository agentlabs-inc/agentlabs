import { Injectable } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { basename, join } from 'path';
import {
  AttachmentMetadata,
  AttachmentStorageService,
  DownloadAttachmentPayload,
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

  private makeAttachmentPath(
    projectId: string,
    agentId: string,
    attachmentId: string,
  ): string {
    return join(
      this.attachmentBasePath,
      'projects',
      projectId,
      'agents',
      agentId,
      attachmentId,
    );
  }

  async upload(data: Buffer, metadata: AttachmentMetadata): Promise<void> {
    const filePath = this.makeAttachmentPath(
      metadata.projectId,
      metadata.agentId,
      metadata.attachmentId,
    );
    const dir = basename(filePath);

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, data);
  }

  async download(payload: DownloadAttachmentPayload): Promise<Buffer> {
    const path = this.makeAttachmentPath(
      payload.projectId,
      payload.agentId,
      payload.attachmentId,
    );
    const buffer = await readFile(path);

    return buffer;
  }
}
