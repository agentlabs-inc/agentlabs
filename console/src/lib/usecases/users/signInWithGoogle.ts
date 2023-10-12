import { env } from "$env/dynamic/public";
import GoogleAuthProvider from "$lib/services/oauth/providers/google";
import { signInWithRedirect } from "$lib/services/oauth/signInWithRedirect";
import { validateEnv } from "$lib/utils/validateEnv";

export const signInWithGoogle = async () => {
	const { PUBLIC_OAUTH_GOOGLE_CLIENT_ID } = validateEnv(env);

	await signInWithRedirect(
		new GoogleAuthProvider({
			clientId: PUBLIC_OAUTH_GOOGLE_CLIENT_ID,
			scopes: [
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile"
			]
		})
	);
};
