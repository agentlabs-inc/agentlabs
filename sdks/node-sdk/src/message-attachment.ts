import { writeFile } from "fs/promises";
import { HttpApi } from "./http";

export interface ApiMessageAttachment {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	mimeType: string;
	checksumSha256: string;
	driver: string;
	sizeBytes: number;
}

export class MessageAttachment {
	public readonly id;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;
	public readonly name: string;
	public readonly mimeType: string;
	public readonly checksumSha256: string;
	public readonly driver: string;
	public readonly sizeBytes: number;

	constructor(private readonly http: HttpApi, apiMessageAttachment: ApiMessageAttachment) {
		this.id = apiMessageAttachment.id;
		this.createdAt = new Date(apiMessageAttachment.createdAt);
		this.updatedAt = new Date(apiMessageAttachment.updatedAt);
		this.name = apiMessageAttachment.name;
		this.mimeType = apiMessageAttachment.mimeType;
		this.checksumSha256 = apiMessageAttachment.checksumSha256;
		this.driver = apiMessageAttachment.driver;
		this.sizeBytes = apiMessageAttachment.sizeBytes;
	}

	/**
	 * Download the contents of this attachment and put them in a Buffer.
	 * Be aware that an attachment can be of significant size (we accept only up to 10MB per attachment)
	 * and that using this method will load the entire attachment into memory.
	 * If you want to download the attachment to a file directly, use downloadToFile() instead.
	 */
	download(): Promise<Buffer> {
		return this.http.download(`/attachments/downloadById/${this.id}`);
	}

	/**
	 * Download the contents of this attachment and write them to a file.
	 * If you want to get the contents of the attachment in a Buffer, use download() instead.
	 */
	async downloadToFile(path: string): Promise<void> {
		const buffer = await this.download();

		await writeFile(path, buffer);
	}
}
