import type { AuthorizationParams, OAuthProvider } from "$lib/services/oauth/types";
import { saveCodeVerifier } from "$lib/services/oauth/codeVerifier";

export const signInWithRedirect = async (provider: OAuthProvider): Promise<void> => {
	const authEndpoint = provider.authUrl;

	const form = document.createElement("form");
	form.setAttribute("method", "GET"); // Send as a GET request.
	form.setAttribute("action", authEndpoint);

	const params: AuthorizationParams = {
		client_id: provider.clientId,
		redirect_uri: `${window.location.origin}/admin/oauth/handler/${provider.id}`,
		response_type: provider.responseType,
		scope: provider.scopes.join(" "),
		include_granted_scopes: "true",
		// This state will contain the value of the common portal provider if needed.
		state: provider.getState(),
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
