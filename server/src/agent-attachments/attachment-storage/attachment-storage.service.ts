import { Injectable } from '@nestjs/common';

export interface AttachmentMetadata {
  projectId: string;
  agentId: string;
  attachmentId: string;
  filename: string;
  mimeType: string;
  checksumSha256: string;
}

@Injectable()
export abstract class AttachmentStorageService {
  abstract upload(data: Buffer, metadata: AttachmentMetadata): Promise<void>;
  abstract download(metadata: AttachmentMetadata): Promise<Buffer>;
}
