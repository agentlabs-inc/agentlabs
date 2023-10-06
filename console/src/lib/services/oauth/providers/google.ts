import type {
	OAuthProvider,
	OAuthProviderId,
	OAuthProviderSettings
} from "$lib/services/oauth/types";

import { unique } from "$lib/utils/unique";
import { randomState } from "$lib/services/oauth/randomState";

export class GoogleAuthProvider implements OAuthProvider {
	public scopes: string[] = [];
	private settings: OAuthProviderSettings;

	constructor(settings: OAuthProviderSettings) {
		if (!settings) {
			throw new Error("GoogleAuthProvider: settings is required");
		}

		if (!settings.clientId) {
			throw new Error("GoogleAuthProvider: clientId is required");
		}

		this.settings = settings;

		this.scopes = unique([...settings.scopes]);
	}

	get id(): OAuthProviderId {
		return "google";
	}

	get clientId(): string {
		return this.settings.clientId;
	}

	get authUrl(): string {
		return "https://accounts.google.com/o/oauth2/v2/auth";
	}

	get responseType(): "code" {
		return "code";
	}

	getState(): string {
		return randomState();
	}

	getCodeChallenge(): Promise<{
		codeChallenge: string;
		codeVerifier: string;
		codeChallengeMethod?: "plain" | "S256";
	}> {
		return Promise.resolve({ codeChallenge: "", codeVerifier: "" });
	}
}

export default GoogleAuthProvider;
