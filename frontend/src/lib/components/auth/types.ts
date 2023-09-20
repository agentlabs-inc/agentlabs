export const AuthProviders = ["google", "github", "gitlab"] as const;
export type AuthProvider = (typeof AuthProviders)[number];
