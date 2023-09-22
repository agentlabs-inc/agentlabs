import type { User } from "$lib/entities/user/user";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import { writable } from "svelte/store";

export const AUTH_STORE_KEY = "agentlabs/client/auth-store";

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
