import dayjs from "dayjs";

export type InitUser = {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
};

export class User {
	constructor(private data: InitUser) {}

	get id(): string {
		return this.data.id;
	}

	get name(): string {
		return this.data.name;
	}

	get email(): string {
		return this.data.email;
	}

	get createdAtForHuman(): string {
		return dayjs(this.data.createdAt).format("MMMM D, YYYY");
	}
}
