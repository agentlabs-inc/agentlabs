import { getContext, setContext } from "svelte";
import type { User } from "$lib/entities/user/user";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

export const AUTH_CONTEXT_KEY = "auth";

export const userStore = writable<User | null>(null);

const login = (email: string, password: string) => {
	// mocked
	userStore.set({
		id: "1",
		email: "",
		fullName: "John Doe",
		isVerified: false,
		createdAt: new Date()
	});
};

const logout = () => {
	userStore.set(null);
};

export interface AuthContext {
	currentUser: Writable<User | null>;
	login: typeof login;
	logout: typeof logout;
}

export const getAuthContext = () => getContext<AuthContext>(AUTH_CONTEXT_KEY);

export const setAuthContext = (ctx: AuthContext) => setContext(AUTH_CONTEXT_KEY, ctx);

export const setCurrentUser = (user: User | null) =>
	setAuthContext({
		login,
		logout,
		currentUser: writable(user)
	});
