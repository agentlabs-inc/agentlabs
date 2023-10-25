import { readFile } from "fs/promises";
import { basename } from 'path';

export class Attachment {
	static fromLocalFile(filePath: string, options: LocalFileAttachmentOptions = {}): AttachmentItem {
		return new LocalFileAttachment(filePath, options);
	}
}

export abstract class AttachmentItem {}

export interface LocalFileAttachmentOptions {
	/**
	 * A custom mime type to enforce on the attachment.
	 * Unless the file has an unusual file extension, you are often better
	 * off letting the mime type be detected automatically by the server.
	 */
	mimeType?: string;
}

export class LocalFileAttachment extends AttachmentItem {
  static maxFileSize = 10 * 1024 * 1024; // 10 MB
  public buffer = Buffer.alloc(0);
  public filename: string;

  constructor(public filePath: string, public options: LocalFileAttachmentOptions = {}) {
	super();
	this.filename = basename(filePath);
  }

  async load(): Promise<void> {
	  this.buffer = await readFile(this.filePath);

	  if (this.buffer.length > LocalFileAttachment.maxFileSize) {
		  throw new Error(`File size exceeds 10MB, which is beyond the maximum allowed size for a single attachment. Consider splitting them up if possible.`);
	  }
  }
}
