export const AuthProviders = [
	"PASSWORDLESS_EMAIL",
	"EMAIL_AND_PASSWORD",
	"SMS",
	"ANONYMOUS",
	"GOOGLE",
	"GITHUB",
	"GITLAB",
	"MICROSOFT"
] as const;
export type AuthProvider = (typeof AuthProviders)[number];

export const AuthProviderNameMap: Record<AuthProvider, string> = {
	GOOGLE: "Google",
	GITHUB: "GitHub",
	GITLAB: "GitLab",
	PASSWORDLESS_EMAIL: "Passwordless email",
	EMAIL_AND_PASSWORD: "Email and password",
	SMS: "SMS",
	ANONYMOUS: "Anonymous",
	MICROSOFT: "Microsoft"
} as const;
