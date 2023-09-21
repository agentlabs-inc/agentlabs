import { getContext, setContext } from "svelte";
import type { User } from "$lib/entities/user/user";
import type { Writable } from "svelte/store";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";
import { writable } from "svelte/store";

export const AUTH_CONTEXT_KEY = "auth";
export const AUTH_STORE_KEY = "auth-store";

export const userStore = writable<User | null>(null);
export const authStore = persist(
	writable({
		accessToken: ""
	}),
	createLocalStorage(),
	AUTH_STORE_KEY
);

export const login = (user: User, accessToken: string) => {
	userStore.set(user);
	authStore.set({
		accessToken
	});
};

const logout = () => {
	userStore.set(null);
	authStore.set({
		accessToken: ""
	});
};

export interface AuthContext {
	currentUser: Writable<User | null>;
}

export const getAuthContext = () => getContext<AuthContext>(AUTH_CONTEXT_KEY);

export const setAuthContext = (ctx: AuthContext) => setContext(AUTH_CONTEXT_KEY, ctx);
