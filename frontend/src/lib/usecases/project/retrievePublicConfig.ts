import { ProjectsService } from "$lib/services/gen-api";
import { setPublicProjectConfig } from "$lib/stores/main-context";

export const retrievePublicConfig = async (hostname: string) => {
	const config = await ProjectsService.getPublicConfig({ hostname });

	setPublicProjectConfig(config);

	console.log("Public config retrieved.", config);

	return config;
};
