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

	let redirectUri =
		`${window.location.protocol}//${window.location.host}/oauth/handler/${authMethod.provider}`.toLowerCase();

	if (authMethod.isUsingDemoConfig) {
		redirectUri =
			`${window.location.protocol}//${environment.PUBLIC_APP_HOST}/oauth/demo_handler/${authMethod.provider}`.toLowerCase();
	}

	let windowObjectReference = null;
	let previousUrl = null;

	const receiveMessage = (event: MessageEvent) => {
		console.log("EVENT", event);
		// Do we trust the sender of this message? (might be
		// different from what we originally opened, for example).
		if (event.origin !== "coucou") {
			return;
		}

		const { data } = event;
		// if we trust the sender and the source is our popup
		if (data.source === "lma-login-redirect") {
			// get the URL params and redirect to our server to use Passport to auth/login
			const { payload } = data;
			const redirectUrl = `/auth/google/login${payload}`;
			window.location.pathname = redirectUrl;
		}
	};

	// remove any existing event listeners
	window.removeEventListener("message", receiveMessage);

	// window features
	const strWindowFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

	window.addEventListener("message", (event) => receiveMessage(event), false);

	const popup = window.open(
		popupUrl,
		"popup",
		"popup=true,toolbar=no,menubar=no,width=600,height=700"
	);
	const checkPopup = setInterval(() => {
		if (!popup || !popup.closed) {
			return;
		}
		if (popup.window.location.href.includes("oauth/handler")) {
			popup.close();
		}
	}, 1000);
};
