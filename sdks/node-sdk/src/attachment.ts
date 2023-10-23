import { readFile } from "fs/promises";

export class Attachment {
	static fromLocalFile(filePath: string): AttachmentItem {
		return new LocalFileAttachment(filePath);
	}
}

export abstract class AttachmentItem {
	abstract load(): Promise<void> | void;
}

export class LocalFileAttachment extends AttachmentItem {
  public buffer = Buffer.alloc(0);

  constructor(public filePath: string) {
	super();
  }

  async load(): Promise<void> {
	  this.buffer = await readFile(this.filePath);
  }
}
