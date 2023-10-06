export interface CreateAttachmentPayload {
  data: Buffer;
  mimeType: string;
  filename: string;
  isPublic?: boolean;
}
