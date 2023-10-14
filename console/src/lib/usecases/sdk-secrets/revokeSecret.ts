import { SdkSecretsService } from "$lib/services/gen-api";

export const revokeSecret = async (secretId: string) => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	const result = await SdkSecretsService.revokedById({
		secretId
	});

	return result;
};
