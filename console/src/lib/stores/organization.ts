import { writable } from "svelte/store";

export const organizationStore = writable<{
	selected: string | null;
}>({
	selected: null
});

export const setCurrentOrganizationId = (id: string | null) => {
	organizationStore.update((store) => {
		store.selected = id;
		return store;
	});
};
