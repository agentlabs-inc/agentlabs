import { writable } from "svelte/store";

export const organizationStore = writable<{
	currentOrganizationId: string | null;
}>({
	currentOrganizationId: null
});

export const setCurrentOrganizationId = (id: string | null) => {
	organizationStore.update((store) => {
		store.currentOrganizationId = id;
		return store;
	});
};
