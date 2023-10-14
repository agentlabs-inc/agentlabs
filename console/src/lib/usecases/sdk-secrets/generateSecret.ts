import type { CreatedSdkSecretDto } from "$lib/services/gen-api";
import { SdkSecretsService } from "$lib/services/gen-api";

export const generateSecret = async (projectId: string): Promise<CreatedSdkSecretDto> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	const secret = await SdkSecretsService.create({
		requestBody: {
			projectId
		}
	});

	return {
		...secret
	};
};
