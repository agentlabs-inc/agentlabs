export const AuthProviders = ["google", "github", "gitlab", "microsoft"] as const;
export type AuthProvider = (typeof AuthProviders)[number];
