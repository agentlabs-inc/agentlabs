import { OpenAPI } from '$lib/services/gen-api/index'

class BackendService {
	private readonly baseUrl = OpenAPI.BASE;

	constructor() {
	}

	private async apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
		const url = this.baseUrl + path;
		const response = await fetch(url, init);

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return await response.json();
	}

	async get<T>(path: string): Promise<T> {
		return await this.apiFetch<T>(path);
	}

	async post<T>(path: string, body: any): Promise<T> {
		return await this.apiFetch<T>(path, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
	}

	async getFile(path: string): Promise<Blob> {
		const url = this.baseUrl + path;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return await response.blob();
	}
}

export const backendService = new BackendService();
