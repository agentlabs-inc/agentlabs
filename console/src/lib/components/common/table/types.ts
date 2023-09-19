export type TableColumn<T> = {
	name: string;
	key: string;
	format?: (rowValue: T) => string;
};

export type TableRow<T> = T;
