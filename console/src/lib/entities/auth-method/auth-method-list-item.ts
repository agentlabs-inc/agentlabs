import type { SvelteComponent } from "svelte";
import type { IconSource } from "svelte-hero-icons";

export type AuthMethodListItem = {
	id: string;
	name: string;
	value: string;
	heroIcon: IconSource | null;
	componentIcon: typeof SvelteComponent<any, any, any> | null;
	available: boolean;
	isEnabled: boolean;
	statusLabel: string;
};
