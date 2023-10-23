export interface CreateAttachmentPayload {
  data: Buffer;
  mimeType: string;
  filename: string;
  size: number;
  projectId: string;
  isPublic?: boolean;
}
