import type { RegisterResponseDto } from "$lib/services/gen-api";
import { MembersService } from "$lib/services/gen-api";

export const requestPasswordlessEmail = async (params: {
	projectId: string;
	email: string;
}): Promise<RegisterResponseDto> => {
	const { projectId, email } = params;

	const result = await MembersService.requestPasswordlessEmail({
		projectId,
		requestBody: {
			email
		}
	});

	return result;
};
