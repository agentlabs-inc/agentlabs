import { goto } from "$app/navigation";
import { env } from "$env/dynamic/public";
import { agentChatRoute } from "$lib/routes/routes";
import type { PublicAuthMethodDto } from "$lib/services/gen-api";
import { createDemoRedirectState } from "$lib/services/oauth/demoRedirectState";
import GoogleAuthProvider from "$lib/services/oauth/providers/google";
import { signInWithRedirect } from "$lib/services/oauth/signInWithRedirect";
import type { OAuthProvider } from "$lib/services/oauth/types";
import { loginWithOAuthCode } from "$lib/usecases/members/loginWithOAuthCode";
import { toastError } from "$lib/utils/toast";
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

	const state = createDemoRedirectState({
		provider: authMethod.provider,
		projectId,
		timestamp: Date.now(),
		initialOrigin: window.location.origin,
		redirectUri
	});

	await signInWithRedirect(provider, redirectUri, state);
};

export const initSignInWithPopup = async (authMethod: PublicAuthMethodDto, projectId: string) => {
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

	const popupUrl = `${window.location.protocol}//${window.location.host}/oauth/sign-in-popup/${authMethod.provider}`;

	let popup: Window | null = null;

	const receiveMessage = async (event: MessageEvent) => {
		// If the sender is not the same domain, it means it's not trustworthy
		if (event.origin !== window.location.origin) {
			return;
		}

		const { data } = event;
		// if we trust the sender and the source is our popup
		if (data.messageType === "OAuthRedirectResult") {
			try {
				await loginWithOAuthCode({
					providerId: authMethod.provider.toLowerCase(),
					redirectUri:
						data.redirectUri ?? `${window.location.origin}${window.location.pathname}`,
					state: data.state,
					code: data.code,
					projectId
				});

				await goto(agentChatRoute.path()).then(() => {
					window.location.reload();
				});

				popup?.close();
			} catch {
				toastError("Impossible to login with this provider. Please try again later.");
			}
		}

		if (data.messageType === "OAuthRedirectError") {
			toastError("Impossible to login with this provider. Please try again later.");
			popup?.close();
		}
	};

	window.removeEventListener("message", receiveMessage);
	window.addEventListener("message", (event) => receiveMessage(event), false);

	popup = window.open(popupUrl, "popup", "popup=true,toolbar=no,menubar=no,width=600,height=700");
};
