import { unique } from "../utils/unique";
import { randomState } from "../utils/randomState";
import type { OAuthProvider, OAuthProviderId } from "./auth-providers.types";

export const GithubMinimumScopes = ["read:user", "user:email"] as const;

export const GithubPossibleScopes = [
	"repo",
	"repo_deployment",
	"repo:status",
	"public_repo",
	"repo:invite",
	"security_events",
	"admin:repo_hook",
	"write:repo_hook",
	"read:repo_hook",
	"admin:org",
	"write:org",
	"read:org",
	"admin:public_key",
	"write:public_key",
	"read:public_key",
	"admin:org_hook",
	"gist",
	"notifications",
	"user",
	"read:user",
	"user:email",
	"user:follow",
	"project",
	"read:project",
	"delete_repo",
	"write:packages",
	"read:packages",
	"delete:packages",
	"admin:gpg_key",
	"write:gpg_key",
	"read:gpg_key",
	"codespace",
	"workflow"
] as const;

export type GithubScope = (typeof GithubPossibleScopes)[number];

export class GithubAuthProvider implements OAuthProvider {
	private scopes: string[] = [];

	constructor(scopes: GithubScope[]) {
		const allScopes = [...scopes, ...GithubMinimumScopes];
		allScopes.forEach((scope) => this.addScope(scope));
	}

	get id(): OAuthProviderId {
		return "github";
	}

	addScope(scope: string): void {
		this.scopes.push(scope);
	}

	getScopes(): string[] {
		return unique(this.scopes);
	}

	getAuthUrl(): string {
		return "https://github.com/login/oauth/authorize";
	}

	getResponseType(): "code" {
		return "code";
	}

	getState(): string {
		return randomState();
	}
}

export default GithubAuthProvider;
