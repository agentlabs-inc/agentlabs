import { ProjectsService, UsersService } from "$lib/services/gen-api";
import dayjs from "dayjs";
import type { UserConfig } from "$lib/entities/user/userConfig";
import { setCurrentOrganizationId } from "$lib/stores/organization";
import { setCurrentProjectId, setProjectList } from "$lib/stores/project";

export const fetchRequiredUserConfig = async (): Promise<UserConfig> => {
	const result = await UsersService.whoami();

	const config: UserConfig = {
		defaultOrganizationId: result.defaultOrganizationId,
		defaultProjectId: result.defaultProjectId,
		organizationCount: result.organizationCount,
		projectCount: result.projectCount,
		projectCreatedCount: result.projectCreatedCount,
		createdAt: new Date(),
		id: result.id,
		email: result.email,
		fullName: result.fullName,
		verifiedAt: dayjs(result.verifiedAt).toDate(),
		onboarding: {
			hasAddedAuthMethod: result.onboarding.hasAddedAuthMethod,
			hasUsedTheApplication: result.onboarding.hasUsedTheApplication,
			projectId: result.onboarding.projectId,
			organizationId: result.onboarding.organizationId
		}
	};

	setCurrentOrganizationId(config.defaultOrganizationId);

	if (config.defaultProjectId && config.defaultOrganizationId) {
		const projects = await ProjectsService.listOrganizationProjects({
			organizationId: config.defaultOrganizationId
		});

		setProjectList(projects.items);
		setCurrentProjectId(projects.items[0]?.id ?? null);
	}

	return config;
};
