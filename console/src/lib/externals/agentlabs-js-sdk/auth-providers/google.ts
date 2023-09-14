import { unique } from "../utils/unique";
import type { OAuthProvider, OAuthProviderId } from "./auth-providers.types";
import type { AuthProviderSettings } from "../common.types";

const GoogleMinimumScopes = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile"
] as const;

// Full scopes list: https://developers.google.com/identity/protocols/oauth2/scopes
// We don't add all scopes because some of them are too sensitive and we don't need them.
const GooglePossibleScopes = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/calendar",
	"https://www.googleapis.com/auth/youtube",
	"https://www.googleapis.com/auth/photoslibrary",
	"https://www.googleapis.com/auth/contacts",
	"https://www.googleapis.com/auth/drive.file",
	"https://www.googleapis.com/auth/spreadsheets",
	"https://www.googleapis.com/auth/presentations",
	"https://www.googleapis.com/auth/webmasters",
	"https://www.googleapis.com/auth/documents",
	"https://www.googleapis.com/auth/analytics.readonly",
	"https://www.googleapis.com/auth/gmail.modify",
	"https://www.googleapis.com/auth/calendar.events"
] as const;

export type GoogleScope = (typeof GooglePossibleScopes)[number];

export class GoogleAuthProvider implements OAuthProvider {
	private scopes: string[] = [];
	private settings: AuthProviderSettings;

	constructor(scopes: GoogleScope[], settings?: AuthProviderSettings) {
		if (!settings) {
			throw new Error("GoogleAuthProvider: settings is required");
		}

		this.settings = settings;

		const allScopes = [...scopes, ...GoogleMinimumScopes];
		allScopes.forEach((scope) => this.addScope(scope));
	}

	get id(): OAuthProviderId {
		return "google";
	}

	addScope(scope: string): void {
		this.scopes.push(scope);
	}

	getScopes(): string[] {
		return unique(this.scopes);
	}

	getAuthUrl(): string {
		return "https://accounts.google.com/o/oauth2/v2/auth";
	}

	getResponseType(): "token" | "code" {
		if (this.settings.oauthSettings?.hasClientSecret) {
			return "code";
		}
		return "token";
	}

	getState(): string {
		return "pass-through value";
	}
}

export default GoogleAuthProvider;
