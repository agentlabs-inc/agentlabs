import { goto } from "$app/navigation";
import { projectNotFoundRoute } from "$lib/routes/routes";
import { retrievePublicConfig } from "$lib/usecases/project/retrievePublicConfig";
import type { Load } from "@sveltejs/kit";
import type { MainLayoutContext } from "./types";

export const ssr = false;

export const load: Load = async (event): Promise<MainLayoutContext> => {
	const hostname = event.url.hostname;

	if (event.url.href.includes("/oauth/demo_handler")) {
		console.log("oauth handler", event.url);
		return {
			mainLayoutLazy: {
				isLoaded: Promise.resolve(true)
			}
		};
	}

	return {
		mainLayoutLazy: {
			isLoaded: retrievePublicConfig(hostname)
				.then(() => true)
				.catch(async (error) => {
					console.error(error);

					await goto(projectNotFoundRoute.path());
					return false;
				})
		}
	};
};
