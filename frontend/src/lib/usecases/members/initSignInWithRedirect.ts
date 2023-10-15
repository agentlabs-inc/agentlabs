import { env } from "$env/dynamic/public";
import type { PublicAuthMethodDto } from "$lib/services/gen-api";
import { createDemoRedirectState } from "$lib/services/oauth/demoRedirectState";
import GoogleAuthProvider from "$lib/services/oauth/providers/google";
import { signInWithRedirect } from "$lib/services/oauth/signInWithRedirect";
import type { OAuthProvider } from "$lib/services/oauth/types";
import { validateEnv } from "$lib/utils/validateEnv";

export const initSignInWithRedirect = async (
	authMethod: PublicAuthMethodDto,
	projectId: string
) => {
	let provider: OAuthProvider | undefined;
	if (authMethod.provider === "GOOGLE") {
		provider = new GoogleAuthProvider({
			clientId: authMethod.clientId,
			scopes: authMethod.scopes
		});
	}

	if (!provider) {
		return;
	}

	const environment = validateEnv(env);

	if (!environment) {
		throw new Error("Missing environment");
	}

	let redirectUri =
		`${window.location.protocol}//${window.location.host}/oauth/handler/${authMethod.provider}`.toLowerCase();

	if (authMethod.isUsingDemoConfig) {
		redirectUri =
			`${window.location.protocol}//${environment.PUBLIC_APP_HOST}/oauth/demo_handler/${authMethod.provider}`.toLowerCase();
	}

	const state = createDemoRedirectState({
		provider: authMethod.provider,
		projectId,
		timestamp: Date.now(),
		initialOrigin: window.location.origin,
		redirectUri
	});

	await signInWithRedirect(provider, redirectUri, state);
};
