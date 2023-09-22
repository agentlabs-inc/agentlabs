import { writable } from "svelte/store";

export const projectStore = writable<{
	currentProjectId: string | null;
}>({
	currentProjectId: null
});

export const setCurrentProjectId = (id: string | null) => {
	projectStore.update((store) => {
		store.currentProjectId = id;
		return store;
	});
};
