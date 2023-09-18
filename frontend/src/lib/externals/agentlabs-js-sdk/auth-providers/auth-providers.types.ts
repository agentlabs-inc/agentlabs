export const OAuthProviderIds = ['google', 'microsoft', 'github', 'gitlab', 'twitter'] as const;
export type OAuthProviderId = (typeof OAuthProviderIds)[number];

export type AuthorizationParams = {
    client_id: string;
    redirect_uri: string;
    response_type: 'token' | 'code';
    scope: string;
    include_granted_scopes: string;
    access_type?: string;
    state: string;
    code_challenge?: string;
    code_challenge_method?: 'plain' | 'S256';
};

export interface OAuthProvider {
    id: OAuthProviderId;
    addScope: (scope: string) => void;
    getScopes: () => string[];
    getAuthUrl: () => string;
    getResponseType: () => 'token' | 'code';
    getState: () => string;
    getCodeChallenge?: () => Promise<{
        codeChallenge: string;
        codeVerifier: string;
        codeChallengeMethod?: 'plain' | 'S256';
    }>;
}
