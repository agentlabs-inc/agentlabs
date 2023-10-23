import type { ComponentType } from "svelte";
import type { IconSource } from "svelte-hero-icons";

export type MultiSelectItem = {
	id: string;
	label: string;
	value: string;
	heroIcon?: IconSource;
	customIcon?: ComponentType;
	disabled?: boolean;
	disabledLabel?: string;
	selected?: boolean;
	required?: boolean;
};
