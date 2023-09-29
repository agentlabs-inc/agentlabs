export const SignInMethods = ["passwordless-email", "google", "github", "gitlab"] as const;
export type SignInMethod = (typeof SignInMethods)[number];

export type MainLayoutContext = {
	mainLayoutLazy: {
		isLoaded: Promise<boolean>;
	};
};
