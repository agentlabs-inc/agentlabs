import { ProjectsService } from "$lib/services/gen-api";
import type { CreateProjectDto } from "$lib/services/gen-api";
import dayjs from "dayjs";
import type { Project } from "$lib/entities/project/project";

export const createProject = async (project: CreateProjectDto): Promise<Project> => {
	const result = await ProjectsService.createProject({
		requestBody: project
	});

	return {
		id: result.id,
		name: result.name,
		organizationId: result.organizationId,
		slug: result.slug,
		createdAt: dayjs(result.createdAt).toDate(),
		updatedAt: dayjs(result.updatedAt).toDate()
	};
};
