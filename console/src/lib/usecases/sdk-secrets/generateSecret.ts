import { SdkSecretsService } from "$lib/services/gen-api";
import type { SdkSecret } from "$lib/entities/sdk-secret/sdk-secret";

export const generateSecret = async (projectId: string): Promise<SdkSecret> => {
	const secret = await SdkSecretsService.create({
		requestBody: {
			description: "SDK Secret generated from the console",
			projectId
		}
	});

	return {
		...secret,
		createdAt: new Date(secret.createdAt),
		updatedAt: new Date(secret.updatedAt)
	};
};
