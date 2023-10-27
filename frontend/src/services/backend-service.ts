import { OpenAPI } from "$lib/services/gen-api/index";
import { authStore } from "$lib/stores/auth";
import { get } from "svelte/store";

class BackendService {
	private readonly baseUrl = OpenAPI.BASE;

	constructor() {}

	private async apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
		const url = this.baseUrl + path;
		const token = get(authStore).accessToken;

		if (token) {
			init.headers = {
				...init.headers,
				Authorization: `Bearer ${token}`
			};
		}

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
			method: "POST",
			headers: { "Content-Type": "application/json" },
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

	async sendFile<T>(path: string, file: File): Promise<T> {
		const formData = new FormData();

		formData.append("file", file);

		return this.apiFetch<T>(path, {
			method: "POST",
			body: formData
		});
	}

	getImagePreviewUrl(imageId: string): string {
		return `${this.baseUrl}/attachments/viewById/${imageId}`;
	}
}

export const backendService = new BackendService();
