import { unique } from "../utils/unique";
import { randomState } from "../utils/randomState";
import type { OAuthProvider, OAuthProviderId } from "./auth-providers.types";

export const GitlabMinimumScopes = ["openid", "profile", "email", "read_user"] as const;

export const GitlabPossibleScopes = [
	"api",
	"read_user",
	"read_api",
	"read_repository",
	"write_repository",
	"read_registry",
	"write_registry",
	"sudo",
	"openid",
	"profile",
	"email",
	"create_runner"
];
export type GitlabScope = (typeof GitlabPossibleScopes)[number];

export class GitlabAuthProvider implements OAuthProvider {
	private scopes: string[] = [];

	constructor(scopes: GitlabScope[]) {
		const allScopes = [...scopes, ...GitlabMinimumScopes];
		allScopes.forEach((scope) => this.addScope(scope));
	}

	get id(): OAuthProviderId {
		return "gitlab";
	}

	addScope(scope: string): void {
		this.scopes.push(scope);
	}

	getScopes(): string[] {
		return unique(this.scopes);
	}

	getAuthUrl(): string {
		return "https://gitlab.com/oauth/authorize";
	}

	getResponseType(): "code" {
		return "code";
	}

	getState(): string {
		return randomState();
	}
}

export default GitlabAuthProvider;
