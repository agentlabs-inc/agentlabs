export const OAuthProviderIds = ["GOOGLE", "GITLAB", "GITHUB"] as const;

export type OAuthProviderId = (typeof OAuthProviderIds)[number];

export interface OAuthProvider {
	id: OAuthProviderId;
	clientId: string;
	scopes: string[];
	authUrl: string;
	getState: () => string;
	responseType: "token" | "code";
	getCodeChallenge?: () => Promise<{
		codeChallenge: string;
		codeVerifier: string;
		codeChallengeMethod?: "plain" | "S256";
	}>;
}

export interface OAuthProviderSettings {
	clientId: string;
	scopes: string[];
}

export type AuthorizationParams = {
	client_id: string;
	redirect_uri: string;
	response_type: "token" | "code";
	scope: string;
	include_granted_scopes: string;
	access_type?: string;
	state: string;
	code_challenge?: string;
	code_challenge_method?: "plain" | "S256";
};
