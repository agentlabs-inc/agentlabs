import type { ListSdkSecretDto } from "$lib/services/gen-api";
import { SdkSecretsService } from "$lib/services/gen-api";

export const fetchSecrets = async (projectId: string): Promise<ListSdkSecretDto> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	const secrets = await SdkSecretsService.listForProject({
		projectId
	});

	return secrets;
};
