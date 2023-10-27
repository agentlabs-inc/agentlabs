import { ProjectConfig } from './project';

export interface UploadSettings {
	filename?: string;
	mimeType?: string;
}

export class HttpApi {
	constructor(private readonly projectConfig: ProjectConfig) {}

	private async fetchApi(path: string, options: RequestInit = {}): Promise<Response> {
		options.headers = {
			...options.headers,
			'x-agentlabs-sdk-secret': this.projectConfig.secret,
			'x-agentlabs-project-id': this.projectConfig.projectId,
		}

		const response = await fetch(`${this.projectConfig.url}/api${path}`, options);
		

		if (!response.ok) {
			throw new Error(`HTTP request failed: ${response.status} ${response.statusText}`);
		}

		return response;
	}

	private async apiFetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
		const response = await this.fetchApi(path, options);

		return response.json();
	}

	private async apiFetchBinary(path: string, options: RequestInit = {}): Promise<Buffer> {
		const response = await this.fetchApi(path, options);
		const abuf = await response.arrayBuffer();

		return Buffer.from(abuf);
	}

	async get<T>(path: string): Promise<T> {
		return this.apiFetchJson(path);
	}

	async download(path: string): Promise<Buffer> {
		return this.apiFetchBinary(path);
	}

	async post<T>(path: string, body: any): Promise<T> {
		return this.apiFetchJson(path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
	}

	async upload<T>(path: string, buffer: Buffer, settings: UploadSettings = {}): Promise<T> {
		const formData = new FormData();
		const blob = new Blob([buffer], { type: settings?.mimeType });

		formData.append('file', blob, settings?.filename);

		return this.apiFetchJson(path, {
			method: 'POST',
			body: formData,
		});
	}
}
