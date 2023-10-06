import { Injectable } from '@nestjs/common';

export interface AttachmentMetadata {
  attachmentId: string;
  filename: string;
  mimeType: string;
  checksumSha256: string;
  extension?: string;
}

// An attachment has to be retrievable by its sole ID, without any other
// kind of metadata. The upload implementation should account for this.
@Injectable()
export abstract class AttachmentStorageService {
  abstract upload(data: Buffer, metadata: AttachmentMetadata): Promise<void>;

  abstract download(attachmentId: string): Promise<Buffer>;

  abstract delete(attachmentId: string): Promise<void>;
}
