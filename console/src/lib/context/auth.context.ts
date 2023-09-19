import { getContext } from "svelte";
import type { User } from "$lib/entities/user/user";
import type { Writable } from "svelte/store";

export interface AuthContext {
	currentUser: Writable<User | null>;
	login: () => void;
	logout: () => void;
}

export const AUTH_CONTEXT_KEY = "auth";

export const getAuthContext = () => getContext<AuthContext>(AUTH_CONTEXT_KEY);
