export const SignInMethodIds = [
	"email-and-password",
	"magic-email-code",
	"google",
	"microsoft",
	"github",
	"gitlab",
	"twitter"
] as const;

export type SignInMethodId = (typeof SignInMethodIds)[number];

// This is the public version of the OAuth settings
export interface AuthProviderSettings {
	id: SignInMethodId;
	isEnabled: boolean;
	settings?: Record<string, any>;
	oauthSettings?: {
		clientId: string;
		hasClientSecret: boolean;
		scopes?: string[];
	};
}
