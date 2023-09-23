import { writable } from "svelte/store";
import type { Project } from "$lib/entities/project/project";

export const projectStore = writable<{
	currentProjectId: string | null;
	list: Project[];
}>({
	currentProjectId: null,
	list: []
});

export const setCurrentProjectId = (id: string | null) => {
	projectStore.update((store) => {
		store.currentProjectId = id;
		return store;
	});
};

export const setProjectList = (list: Project[]) => {
	projectStore.update((store) => {
		store.list = list;
		return store;
	});
};
