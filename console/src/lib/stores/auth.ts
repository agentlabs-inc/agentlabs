import type { User } from "$lib/entities/user/user";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import { get, writable } from "svelte/store";
import { genStoreKey } from "$lib/utils/genStoreKey";

export const AUTH_STORE_KEY = genStoreKey("auth-store");

export type AuthStore = {
	accessToken: string;
	user: User | null;
};

export const authStore = persist(
	writable<AuthStore>({
		accessToken: "",
		user: null
	}),
	createLocalStorage(),
	AUTH_STORE_KEY
);

export const setUserAuth = (user: User, accessToken: string) => {
	authStore.set({
		accessToken,
		user
	});
};

export const getCurrentUser = (): User | null => {
	return get(authStore).user;
};

export const getAccessTokenPromise = async (): Promise<string> => {
	return new Promise((resolve) => {
		authStore.subscribe((store) => {
			resolve(store.accessToken ?? "");
		});
	});
};

export const forgetUser = () => {
	authStore.set({
		accessToken: "",
		user: null
	});
};
