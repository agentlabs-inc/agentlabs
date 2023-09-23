import { ProjectsService, UsersService } from "$lib/services/gen-api";
import dayjs from "dayjs";
import type { UserConfig } from "$lib/entities/user/userConfig";
import { setCurrentOrganizationId } from "$lib/stores/organization";
import { setCurrentProjectId, setProjectList } from "$lib/stores/project";
import type { Project } from "$lib/entities/project/project";

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
		const res = await ProjectsService.listOrganizationProjects({
			organizationId: config.defaultOrganizationId
		});

		const projects: Project[] = res.items.map((item) => ({
			id: item.id,
			name: item.name,
			slug: item.slug,
			organizationId: item.organizationId,
			createdAt: dayjs(item.createdAt).toDate(),
			updatedAt: dayjs(item.updatedAt).toDate()
		}));

		setProjectList(projects);
		setCurrentProjectId(res.items[0]?.id ?? null);
	}

	return config;
};
