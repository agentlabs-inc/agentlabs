export const AuthProviders = ["GOOGLE", "GITHUB", "GITLAB"] as const;
export type AuthProvider = (typeof AuthProviders)[number];

export const AuthProviderNameMap: Record<AuthProvider, string> = {
	GOOGLE: "Google",
	GITHUB: "GitHub",
	GITLAB: "GitLab"
} as const;
