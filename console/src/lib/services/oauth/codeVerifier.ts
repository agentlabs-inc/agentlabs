const CODE_VERIFIER_SESSION_KEY = "agentlabs/console/oauth/code-verifier";

export const saveCodeVerifier = (codeVerifier: string): void => {
	sessionStorage.setItem(CODE_VERIFIER_SESSION_KEY, codeVerifier);
};

export const getCodeVerifier = (): string | null => {
	return sessionStorage.getItem(CODE_VERIFIER_SESSION_KEY);
};
