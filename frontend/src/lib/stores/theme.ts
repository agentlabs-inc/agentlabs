import { genStoreKey } from "$lib/utils/genStoreKey";
import { createLocalStorage, persist } from "@macfja/svelte-persistent-store";
import { writable } from "svelte/store";

export type Theme = "light" | "dark";

const THEME_STORE_KEY = genStoreKey("theme-store");

export const themeStore = persist(writable<Theme>("dark"), createLocalStorage(), THEME_STORE_KEY);
