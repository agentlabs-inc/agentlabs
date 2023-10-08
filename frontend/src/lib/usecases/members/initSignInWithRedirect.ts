import type { PublicAuthMethodDto } from "$lib/services/gen-api";
import { createDemoRedirectState } from "$lib/services/oauth/demoRedirectState";
import GoogleAuthProvider from "$lib/services/oauth/providers/google";
import { signInWithRedirect } from "$lib/services/oauth/signInWithRedirect";
import type { OAuthProvider } from "$lib/services/oauth/types";

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

	let redirectUri = `${window.location.protocol}//${
		window.location.origin.split(".", 2)[1]
	}/oauth/handler/${authMethod.provider}`.toLowerCase();

	if (authMethod.isUsingDemoConfig) {
		redirectUri = `${window.location.protocol}//${
			window.location.origin.split(".", 2)[1]
		}/oauth/demo_handler/${authMethod.provider}`.toLowerCase();
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
