import { getUrl, navigateToUrl, parseUrlHashParams, parseUrlParams } from "./navigator";
import type {
	AgentLabsApp,
	SignInMethodId,
	SignInMethods
} from "$lib/externals/agentlabs-js-sdk/agentlabs";

import type {
	AuthorizationParams,
	OAuthProvider
} from "$lib/externals/agentlabs-js-sdk/auth-providers/auth-providers.types";

type UserAuth = {
	email: string;
	hasPassword: boolean;
};

type UserCustomFields = Record<string, string>;
type UserMetadata = Record<string, string | number>;

const ACCESS_TOKEN_STORAGE_KEY = "agentlabs:db:accessToken";
const MEMBER_STORAGE_KEY = "agentlabs:db:user";
const MEMBER_SAVED_AT_KEY = "agentlabs:db:userSavedAt";
const CODE_VERIFIER_SESSION_KEY = "agentlabs:db:codeVerifier";

export type CodeRedirectResult = {
	code: string;
	state: string;
};

export type OAuthRedirectResult = CodeRedirectResult;

export const isCodeRedirectResult = (result: OAuthRedirectResult): result is CodeRedirectResult => {
	return (result as CodeRedirectResult).code !== undefined;
};

export type Auth = {
	id: string;
	auth: UserAuth;
	customFields: UserCustomFields;
	metadata: UserMetadata;
	name?: string;
	givenName?: string;
	familyName?: string;
	pictureUrl?: string;
	stripeId?: string;
	stripeLink?: string;
	subscriptionId?: string;
	planId?: string;
	priceId?: string;
	createdAtMs: number;
	updatedAtMs: number;
};

export type SignUpResponse = Auth;

export type SignInResponse = {
	user: Auth;
	accessToken: string;
};

export type AuthorizeParams = {
	clientId: string;
	redirectUri: string;
	responseType: string;
	scope: string;
};

export const signUpWithEmailAndPassword = async (
	auth: AgentLabsAuth,
	email: string,
	password: string
): Promise<SignUpResponse> => {
	const url = auth.getAuthBaseUrl() + "/signUpWithEmailAndPassword";
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			password,
			projectId: auth.getProjectId()
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	return json as SignUpResponse;
};

export const requestMagicEmailCode = async (auth: AgentLabsAuth, email: string) => {
	if (!auth) throw new Error("Missing plugin lab app argument");
	if (!email) throw new Error("Missing email argument");

	const url = auth.getAuthBaseUrl() + "/requestMagicEmailCode";
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			projectId: auth.getProjectId()
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	return json as SignUpResponse;
};

export const signInWithMagicEmailCode = async (
	auth: AgentLabsAuth,
	email: string,
	code: string
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");
	if (!email) throw new Error("Missing email argument");
	if (!code) throw new Error("Missing code argument");

	const url = auth.getAuthBaseUrl() + "/signInWithMagicEmailCode";
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			code,
			projectId: auth.getProjectId()
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithEmailAndPassword = async (
	auth: AgentLabsAuth,
	email: string,
	password: string
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");
	if (!email) throw new Error("Missing email argument");
	if (!password) throw new Error("Missing password argument");

	const url = auth.getAuthBaseUrl() + "/signInWithEmailAndPassword";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email,
			password,
			projectId: auth.getProjectId()
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithGoogleCode = async (
	auth: AgentLabsAuth,
	params: {
		code: string;
		state: string;
		redirectUri: string;
	}
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");

	const { code, state, redirectUri } = params;

	if (!code) throw new Error("Missing code argument");
	if (!state) throw new Error("Missing state argument");
	if (!redirectUri) throw new Error("Missing redirectUri argument");

	const url = auth.getAuthBaseUrl() + "/signInWithGoogleCode";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			projectId: auth.getProjectId(),
			code,
			state,
			redirectUri
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithGoogleToken = async (
	auth: AgentLabsAuth,
	accessToken: string
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");
	if (!accessToken) throw new Error("Missing accessToken argument");

	const url = auth.getAuthBaseUrl() + "/signInWithGoogleToken";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			accessToken,
			projectId: auth.getProjectId()
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithTwitterCode = async (
	auth: AgentLabsAuth,
	params: {
		code: string;
		redirectUri: string;
		state: string;
	}
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");

	const { code, redirectUri, state } = params;

	if (!code) throw new Error("Missing code argument");
	if (!redirectUri) throw new Error("Missing redirectUri argument");
	if (!state) throw new Error("Missing state argument");

	const url = auth.getAuthBaseUrl() + "/signInWithTwitterCode";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			projectId: auth.getProjectId(),
			code,
			redirectUri,
			state,
			codeVerifier: getCodeVerifier()
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithMicrosoftCode = async (
	auth: AgentLabsAuth,
	params: {
		code: string;
		redirectUri: string;
		state: string;
	}
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");

	const { code, redirectUri, state } = params;

	if (!code) throw new Error("Missing code argument");
	if (!redirectUri) throw new Error("Missing redirectUri argument");
	if (!state) throw new Error("Missing state argument");

	const url = auth.getAuthBaseUrl() + "/signInWithMicrosoftCode";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			projectId: auth.getProjectId(),
			code,
			redirectUri,
			state
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithGithubCode = async (
	auth: AgentLabsAuth,
	params: {
		code: string;
	}
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");

	const { code } = params;

	if (!code) throw new Error("Missing code argument");

	const url = auth.getAuthBaseUrl() + "/signInWithGithubCode";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			projectId: auth.getProjectId(),
			code
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

export const signInWithGitlabCode = async (
	auth: AgentLabsAuth,
	params: {
		code: string;
		state: string;
		redirectUri: string;
	}
): Promise<SignInResponse> => {
	if (!auth) throw new Error("Missing plugin lab app argument");

	const { code, state, redirectUri } = params;

	if (!code) throw new Error("Missing code argument");

	const url = auth.getAuthBaseUrl() + "/signInWithGitlabCode";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			projectId: auth.getProjectId(),
			code,
			state,
			redirectUri
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (json.accessToken && json.user) {
		storeAccessToken(json.accessToken);
		storeUser(json.user);
		auth.onAuthStateChangedCallback?.(json.user);
	}

	return json as SignInResponse;
};

const saveCodeVerifier = (codeVerifier: string): void => {
	sessionStorage.setItem(CODE_VERIFIER_SESSION_KEY, codeVerifier);
};

export const getCodeVerifier = (): string | null => {
	return sessionStorage.getItem(CODE_VERIFIER_SESSION_KEY);
};

const generateDevPortalCompatibleState = (): string => {
	const stateObj = { originHostname: window.location.origin, timestamp: Date.now() };
	return btoa(JSON.stringify(stateObj));
};

export const getProviderRedirectUri = (auth: AgentLabsAuth, provider: SignInMethodId) => {
	return window.location.origin + "/oauth/handler";
};

export const signInWithRedirect = async (
	auth: AgentLabsAuth,
	provider: OAuthProvider
): Promise<void> => {
	if (!auth) throw new Error("Missing AgentLabs app argument");

	const authEndpoint = provider.getAuthUrl();

	const form = document.createElement("form");
	form.setAttribute("method", "GET"); // Send as a GET request.
	form.setAttribute("action", authEndpoint);

	const providerConfiguration = auth.getOAuthSignInMethods()[provider.id];

	if (!providerConfiguration)
		throw new Error(
			`Missing provider configuration for ${provider.id}. Register your provider in your AgentLabs dashboard.`
		);

	if (!providerConfiguration?.oauthSettings) {
		throw new Error("Missing oauthSettings in provider configuration");
	}

	const params: AuthorizationParams = {
		client_id: providerConfiguration.oauthSettings.clientId,
		redirect_uri: auth.getDefaultRedirectUrl(),
		response_type: provider.getResponseType(),
		scope: provider.getScopes().join(" "),
		include_granted_scopes: "true",
		// This state will contain the value of the common portal provider if needed.
		state: generateDevPortalCompatibleState(),
		code_challenge: undefined,
		code_challenge_method: undefined
	};

	if (params.response_type === "code") {
		params.access_type = "offline";
	}

	if (provider.getCodeChallenge) {
		const { codeChallenge, codeVerifier, codeChallengeMethod } =
			await provider.getCodeChallenge();
		params.code_challenge = codeChallenge;
		params.code_challenge_method = codeChallengeMethod;

		saveCodeVerifier(codeVerifier);
	}

	const paramsCpy = { ...params } as Record<string, string>;

	for (const p in paramsCpy) {
		if (!paramsCpy[p]) continue;

		const input = document.createElement("input");
		input.setAttribute("type", "hidden");
		input.setAttribute("name", p);
		input.setAttribute("value", paramsCpy[p]);
		form.appendChild(input);
	}

	document.body.appendChild(form);
	form.submit();
};

export const getRedirectResult = async (auth: AgentLabsAuth): Promise<OAuthRedirectResult> => {
	if (!auth) throw new Error("Missing AgentLabs auth argument");

	const currentUrl = getUrl();
	let urlParams = parseUrlParams(currentUrl);

	if (!Object.values(urlParams).length) {
		urlParams = parseUrlHashParams();
	}

	if (!urlParams.access_token && !urlParams.code) {
		throw new Error("Missing access_token or code url param");
	}

	return {
		code: urlParams.code,
		state: urlParams.state
	};
};

export const startAuthorizationFlow = async (auth: AgentLabsAuth) => {
	if (!auth) throw new Error("Missing plugin lab auth argument");

	const url = auth.getOauthBaseUrl() + "/authorize";

	const currentUrl = getUrl();
	const urlParams = parseUrlParams(currentUrl);

	const requiredParams = ["client_id", "redirect_uri", "response_type"];

	if (requiredParams.some((param) => !urlParams[param])) {
		throw new Error(`Missing required url param`);
	}

	const userId = getSessionStorageUserId();

	if (!userId) {
		throw new Error("Cannot start authorization flow for unauthenticated user.");
	}

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			clientId: urlParams.client_id,
			redirectUri: urlParams.redirect_uri,
			responseType: urlParams.response_type,
			userId
		})
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw json;
	}

	if (!json.redirectUri) {
		throw new Error("Missing redirectUri in response");
	}

	await navigateToUrl(`${json.redirectUri}&state=${urlParams.state}`);

	return json;
};

const storeAccessToken = (accessToken: string) => {
	localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

const getAccessToken = (): string | null => {
	return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

const storeUser = (user: Auth) => {
	sessionStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(user));
	sessionStorage.setItem(MEMBER_SAVED_AT_KEY, Date.now().toString());
};

const getSessionStorageUser = (): {
	user: Auth | null;
	savedAt: number;
} => {
	const user = sessionStorage.getItem(MEMBER_STORAGE_KEY);

	if (!user) {
		return { user: null, savedAt: 0 };
	}

	return {
		user: JSON.parse(user),
		savedAt: parseInt(sessionStorage.getItem(MEMBER_SAVED_AT_KEY) ?? "0")
	};
};

const getSessionStorageUserId = (): string | null => {
	return getSessionStorageUser().user?.id ?? null;
};

const fetchUser = async (baseUrl: string, accessToken: string) => {
	const url = baseUrl + "/me";

	const response = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const json = await response.json();

	if (response.status >= 300) {
		throw "auth/me-unauthorized";
	}

	if (json.user) {
		storeUser(json.user);
	}

	return json.user;
};

const ONE_MINUTE = 60 * 1000;

export const getCurrentUser = async (
	auth: AgentLabsAuth,
	cacheDurationMs = ONE_MINUTE
): Promise<Auth | null> => {
	const accessToken = getAccessToken();

	if (!accessToken) {
		auth.onAuthStateChangedCallback?.(null);
		return null;
	}

	const userSession = getSessionStorageUser();

	const now = Date.now();
	const isCacheExpired = now - userSession.savedAt > cacheDurationMs;

	if (userSession.user && !isCacheExpired) {
		auth.onAuthStateChangedCallback?.(userSession.user);
		return userSession.user;
	}

	try {
		const user = await fetchUser(auth.getAuthBaseUrl(), accessToken);

		auth.onAuthStateChangedCallback?.(user);

		return user;
	} catch (e) {
		return null;
	}
};

export const getCurrentUserId = async (auth: AgentLabsAuth): Promise<string | null> => {
	const user = await getCurrentUser(auth);

	if (!user) {
		return null;
	}

	return user.id;
};
export const signOut = async (auth: AgentLabsAuth) => {
	localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	sessionStorage.removeItem(MEMBER_STORAGE_KEY);
	auth.onAuthStateChangedCallback?.(null);
	return Promise.resolve();
};
export interface AgentLabsAuth {
	getOauthBaseUrl: () => string;
	getAuthBaseUrl: () => string;
	getDefaultRedirectUrl: () => string;
	onAuthStateChangedCallback?: (user: Auth | null) => void;
	onAuthStateChanged: (callback: (user: Auth | null) => void) => void;
	getProjectId: () => string;
	getOAuthSignInMethods: () => SignInMethods;
}

type AgentLabsAuthOptions = {
	authBaseUrl?: string;
	oauthBaseUrl?: string;
};

class AgentLabsAuthImpl implements AgentLabsAuth {
	private callback?: (user: Auth | null) => void;

	constructor(private app: AgentLabsApp, private options?: AgentLabsAuthOptions) {}

	onAuthStateChangedCallback(user: Auth | null): void {
		if (this.callback) {
			return this.callback(user);
		}
	}

	onAuthStateChanged(callback: (user: Auth | null) => void) {
		this.callback = callback;
		getCurrentUser(this);
	}

	getDefaultRedirectUrl() {
		return window.location.origin + "/__/auth/handler";
	}

	getAuthBaseUrl(): string {
		if (this.options?.authBaseUrl) {
			return this.options.authBaseUrl;
		}

		if (!process.env.AUTH_BASE_URL) {
			throw new Error("Missing AUTH_BASE_URL env variable");
		}
		return process.env.AUTH_BASE_URL;
	}

	getOauthBaseUrl(): string {
		if (this.options?.oauthBaseUrl) {
			return this.options.oauthBaseUrl;
		}

		if (!process.env.OAUTH_BASE_URL) {
			throw new Error("Missing OAUTH_BASE_URL env variable");
		}
		return process.env.OAUTH_BASE_URL;
	}
	getProjectId(): string {
		return this.app.getProject().id;
	}

	getOAuthSignInMethods(): SignInMethods {
		return this.app.getOAuthConfig().signInMethods;
	}
}

export const getAuth = (app: AgentLabsApp, options?: AgentLabsAuthOptions): AgentLabsAuth => {
	return new AgentLabsAuthImpl(app, options);
};

export default {
	signOut,
	signInWithEmailAndPassword,
	signUpWithEmailAndPassword,
	requestMagicEmailCode,
	signInWithMagicEmailCode,
	signInWithRedirect,
	signInWithGoogleToken,
	getRedirectResult,
	isCodeRedirectResult,
	startAuthorizationFlow,
	getCurrentUser,
	getCurrentUserId,
	getAuth,
	getCodeVerifier
};
