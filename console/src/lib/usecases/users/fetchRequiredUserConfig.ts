import { UsersService } from "$lib/services/gen-api";
import dayjs from "dayjs";
import type { UserConfig } from "$lib/entities/user/userConfig";
import { setCurrentOrganizationId } from "$lib/stores/organization";

export const fetchRequiredUserConfig = async (): Promise<UserConfig> => {
	const result = await UsersService.whoami();

	const config: UserConfig = {
		defaultOrganizationId: result.defaultOrganizationId,
		organizationCount: result.organizationCount,
		projectCount: result.projectCount,
		projectCreatedCount: result.projectCreatedCount,
		createdAt: new Date(),
		id: result.id,
		email: result.email,
		fullName: result.fullName,
		verifiedAt: dayjs(result.verifiedAt).toDate()
	};

	setCurrentOrganizationId(config.defaultOrganizationId);

	return config;
};
