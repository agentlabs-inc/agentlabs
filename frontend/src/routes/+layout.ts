import { goto } from "$app/navigation";
import { projectNotFoundRoute } from "$lib/routes/routes";
import { retrievePublicConfig } from "$lib/usecases/project/retrievePublicConfig";
import type { Load } from "@sveltejs/kit";
import type { MainLayoutContext } from "./types";

export const ssr = false;

export const load: Load = async (event): Promise<MainLayoutContext> => {
	const hostname = event.url.hostname;

	return {
		mainLayoutLazy: {
			isLoaded: retrievePublicConfig(hostname)
				.then(() => true)
				.catch(async () => {
					await goto(projectNotFoundRoute.path());
					return false;
				})
		}
	};
};
