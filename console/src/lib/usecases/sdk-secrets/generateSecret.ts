import type { CreatedSdkSecretDto } from "$lib/services/gen-api";
import { SdkSecretsService } from "$lib/services/gen-api";

export const generateSecret = async (projectId: string): Promise<CreatedSdkSecretDto> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	const secret = await SdkSecretsService.create({
		requestBody: {
			description: "SDK Secret generated from the console",
			projectId
		}
	});

	return {
		...secret
	};
};
