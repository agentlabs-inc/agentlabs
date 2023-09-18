export type InitConfig = {
	project: ProjectConfig;
	signInMethods: SignInMethods;
};

export const SignInMethodIds = [
	"email-and-password",
	"magic-email-code",
	"google",
	"github",
	"gitlab",
	"microsoft",
	"twitter"
] as const;

export type SignInMethodId = (typeof SignInMethodIds)[number];

export interface SignInMethodOAuthSettings {
	clientId: string;
	scopes?: string[];
	hasClientSecret: boolean;
	isDevMode?: boolean;
}

export interface SignInMethod {
	id: SignInMethodId;
	isEnabled: boolean;
	settings?: Record<string, any>;
	oauthSettings?: SignInMethodOAuthSettings;
}

export type SignInMethods = Partial<Record<SignInMethodId, SignInMethod>>;

export type PublicOAuthConfig = {
	signInMethods: SignInMethods;
};

export type ProjectConfig = {
	id: string;
	slug: string;
	name: string;
};

export class AgentLabsApp {
	constructor(protected config: InitConfig) {}

	getProject(): ProjectConfig {
		return this.config.project;
	}

	getOAuthConfig(): PublicOAuthConfig {
		return { signInMethods: this.config.signInMethods };
	}
}
