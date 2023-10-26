import type { IconSource } from "svelte-hero-icons";

export type MultiSelectChoice = {
	id: string;
	label: string;
	value: string;
	heroIcon?: IconSource;
	disabled?: boolean;
	disabledLabel?: string;
	selected?: boolean;
	required?: boolean;
};
