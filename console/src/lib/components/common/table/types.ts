import type { SvelteComponent } from "svelte";

export type TableColumn<T, K extends keyof T> = {
	name: string;
	key: K;
	format?: (rowValue: T) => string;
	customComponent?: typeof SvelteComponent<{ cellValue: any }>;
};

export type TableRow<T> = T;
