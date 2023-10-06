import { signInWithRedirect } from "$lib/services/oauth/signInWithRedirect";
import GoogleAuthProvider from "$lib/services/oauth/providers/google";
import { PUBLIC_OAUTH_GOOGLE_CLIENT_ID } from "$env/static/public";

export const signInWithGoogle = async () => {
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
