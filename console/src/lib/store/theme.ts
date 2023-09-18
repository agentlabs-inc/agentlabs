import { writable } from "svelte/store";

export const theme = writable<"light" | "dark">("light");
