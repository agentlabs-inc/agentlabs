export type TableColumn<T, K extends keyof T> = {
	name: string;
	key: K;
	format?: (rowValue: T) => string;
};

export type TableRow<T> = T;
