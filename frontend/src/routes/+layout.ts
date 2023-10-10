import { goto } from "$app/navigation";
import { projectNotFoundRoute } from "$lib/routes/routes";
import { mainContextStore } from "$lib/stores/main-context";
import { retrievePublicConfig } from "$lib/usecases/project/retrievePublicConfig";
import type { Load } from "@sveltejs/kit";
import { get } from "svelte/store";
import type { MainLayoutContext } from "./types";

export const ssr = false;

export const load: Load = async (event): Promise<MainLayoutContext> => {
	const hostname = event.url.hostname;

	const contextHostname = get(mainContextStore).publicProjectConfig?.hostname;

	if (contextHostname === hostname) {
		return {
			mainLayoutLazy: {
				isLoaded: Promise.resolve(true)
			}
		};
	}

	if (event.url.href.includes("/oauth/demo_handler")) {
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
