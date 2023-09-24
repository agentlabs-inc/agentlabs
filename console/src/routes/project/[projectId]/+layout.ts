import type { LayoutLoadEvent, LayoutLoad } from "./$types";
import { setCurrentProjectId } from "$lib/stores/project";

export const load: LayoutLoad = async (event: LayoutLoadEvent) => {
	const { projectId } = event.params;
	setCurrentProjectId(projectId);
};
