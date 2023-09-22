import { AuthMethodsService } from "$lib/services/gen-api";

export const initProjectAuthMethods = async (projectId: string): Promise<{ success: boolean }> => {
	const result = await AuthMethodsService.createDemoAuthMethod({
		requestBody: {
			projectId,
			methodTypes: ["PASSWORDLESS_EMAIL"]
		}
	});

	return {
		...result
	};
};
