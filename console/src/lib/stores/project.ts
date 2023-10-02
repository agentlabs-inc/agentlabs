import { writable } from "svelte/store";
import type { Project } from "$lib/entities/project/project";
import { get } from "svelte/store";

export const projectStore = writable<{
	currentProjectId: string | null;
	list: Project[];
	currentProject: Project | null;
}>({
	currentProjectId: null,
	currentProject: null,
	list: []
});

export const setCurrentProjectId = (id: string | null) => {
	projectStore.update((store) => {
		const project = store.list.find((project) => project.id === id);

		if (!project) {
			console.error("Project not in store");
		}

		store.currentProjectId = id;
		store.currentProject = project ?? null;
		return store;
	});
};

export const setCurrentProject = (project: Project) => {
	projectStore.update((store) => {
		store.currentProject = project;
		store.currentProjectId = project.id;
		return store;
	});
};

export const setProjectList = (list: Project[]) => {
	projectStore.update((store) => {
		store.list = list;
		return store;
	});
};
