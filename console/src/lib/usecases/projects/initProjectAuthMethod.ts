import { AuthMethodsService } from "$lib/services/gen-api";
import type { MultiSelectItem } from "$lib/components/common/multi-select/types";

export const initProjectAuthMethods = async (
	projectId: string,
	methods: MultiSelectItem[]
): Promise<{ success: boolean }> => {
	console.log("all methods not implemented", methods);
	const result = await AuthMethodsService.createDemoAuthMethod({
		requestBody: {
			projectId,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			methodTypes: ["PASSWORDLESS_EMAIL"]
		}
	});

	return {
		...result
	};
};
