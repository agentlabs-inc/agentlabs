import { Injectable } from '@nestjs/common';

export interface AttachmentMetadata {
  projectId: string;
  agentId: string;
  attachmentId: string;
  filename: string;
  mimeType: string;
  checksumSha256: string;
}

export interface DownloadAttachmentPayload {
  projectId: string;
  agentId: string;
  attachmentId: string;
}

@Injectable()
export abstract class AttachmentStorageService {
  abstract upload(data: Buffer, metadata: AttachmentMetadata): Promise<void>;
  abstract download(payload: DownloadAttachmentPayload): Promise<Buffer>;
}
