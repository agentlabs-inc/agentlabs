import type { User } from "$lib/entities/user/user";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import { writable } from "svelte/store";

export const AUTH_STORE_KEY = "agentlabs/client/auth-store";

export const authStore = persist(
	writable<{
		accessToken: string;
		user: User | null;
	}>({
		accessToken: "",
		user: null
	}),
	createLocalStorage(),
	AUTH_STORE_KEY
);

export const login = (user: User, accessToken: string) => {
	authStore.set({
		accessToken,
		user
	});
};

export const getAccessTokenPromise = async (): Promise<string> => {
	return new Promise((resolve) => {
		const unsubscribe = authStore.subscribe((store) => {
			if (store.accessToken) {
				resolve(store.accessToken ?? "");
				unsubscribe();
			}
		});
	});
};

export const logout = () => {
	authStore.set({
		accessToken: "",
		user: null
	});
};
