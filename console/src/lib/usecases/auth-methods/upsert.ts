import type { UpsertAuthMethodDto } from "$lib/services/gen-api";
import { AuthMethodsService } from "$lib/services/gen-api";

export const upsertAuthMethod = async (authMethod: UpsertAuthMethodDto) => {
	return AuthMethodsService.upsert({
		requestBody: {
			...authMethod
		}
	});
};
