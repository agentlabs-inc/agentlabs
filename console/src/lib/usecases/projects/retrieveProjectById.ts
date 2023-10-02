import { ProjectsService } from "$lib/services/gen-api";
import type { Project } from "$lib/entities/project/project";
import dayjs from "dayjs";

export const retrieveProjectById = async (projectId: string): Promise<Project> => {
	const result = await ProjectsService.getById({
		projectId
	});

	return {
		createdAt: dayjs(result.createdAt).toDate(),
		id: result.id,
		name: result.name,
		organizationId: result.organizationId,
		slug: result.slug,
		updatedAt: dayjs(result.updatedAt).toDate()
	};
};
