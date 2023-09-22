import type { SvelteComponent } from "svelte";
import type { IconSource } from "svelte-hero-icons";

export type MultiSelectItem = {
	id: string;
	label: string;
	value: string;
	heroIcon?: IconSource;
	customIcon?: SvelteComponent;
};
