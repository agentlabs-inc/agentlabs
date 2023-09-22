import { writable } from "svelte/store";

export type Theme = "light" | "dark";
export const themeStore = writable<Theme>("light");
