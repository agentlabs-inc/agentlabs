export const SignInMethods = ["PASSWORDLESS_EMAIL", "GOOGLE"] as const;
export type SignInMethod = (typeof SignInMethods)[number];

export type MainLayoutContext = {
	lazy: {
		context: Promise<{
			tenantName: string;
			allowedSignInMethods: SignInMethod[];
		}>;
	};
};
