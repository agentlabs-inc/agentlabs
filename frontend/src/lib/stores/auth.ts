import type { Member } from "$lib/entities/member/member";
import { genStoreKey } from "$lib/utils/genStoreKey";
import { createLocalStorage, persist } from "@macfja/svelte-persistent-store";
import { get, writable } from "svelte/store";

export const AUTH_STORE_KEY = genStoreKey("auth-store");

export type AuthStore = {
	accessToken: string | null;
	member: Member | null;
};

export const authStore = persist(
	writable<AuthStore>({
		accessToken: null,
		member: null
	}),
	createLocalStorage(),
	AUTH_STORE_KEY
);

export const setMemberAuth = (member: Member, accessToken: string) => {
	authStore.set({
		accessToken,
		member
	});
};

export const getCurrentMember = (): Member | null => {
	return get(authStore).member;
};

export const getAccessTokenPromise = async (): Promise<string> => {
	return new Promise((resolve) => {
		authStore.subscribe((store) => {
			resolve(store.accessToken ?? "");
		});
	});
};

export const forgetMember = () => {
	authStore.set({
		accessToken: null,
		member: null
	});
};
