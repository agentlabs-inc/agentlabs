import type { IconSource } from "svelte-hero-icons";

export type NavItemType = {
	path: string;
	label: string;
	icon?: IconSource;
};
