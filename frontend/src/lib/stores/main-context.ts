import type { PublicProjectConfigDto } from "$lib/services/gen-api";
import { get, writable } from "svelte/store";

export type MainContextStore = {
	publicProjectConfig: PublicProjectConfigDto | null;
};

export const mainContextStore = writable<MainContextStore>({
	publicProjectConfig: null
});

export const setPublicProjectConfig = (value: PublicProjectConfigDto) => {
	mainContextStore.update((store) => {
		store.publicProjectConfig = value;
		return store;
	});
};

export const getMainContextStore = () => {
	return get(mainContextStore);
};

