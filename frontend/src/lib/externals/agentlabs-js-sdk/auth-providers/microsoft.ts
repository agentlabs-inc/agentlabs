import { unique } from "../utils/unique";
import { randomState } from "../utils/randomState";
import type { OAuthProvider, OAuthProviderId } from "./auth-providers.types";

export class MicrosoftAuthProvider implements OAuthProvider {
	private scopes: string[] = [];

	constructor() {
		this.addScope("openid");
		this.addScope("profile");
		this.addScope("email");
	}

	get id(): OAuthProviderId {
		return "microsoft";
	}

	addScope(scope: string): void {
		this.scopes.push(scope);
	}

	getScopes(): string[] {
		return unique(this.scopes);
	}

	getAuthUrl(): string {
		return "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
	}

	getResponseType(): "code" {
		return "code";
	}

	getState(): string {
		return randomState();
	}
}

export default MicrosoftAuthProvider;
