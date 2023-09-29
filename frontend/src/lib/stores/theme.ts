import { writable } from "svelte/store";
import { createLocalStorage, persist } from "@macfja/svelte-persistent-store";
import { genStoreKey } from "$lib/utils/genStoreKey";

export type Theme = "light" | "dark";

const THEME_STORE_KEY = genStoreKey("theme-store");

export const themeStore = persist(writable<Theme>("light"), createLocalStorage(), THEME_STORE_KEY);
