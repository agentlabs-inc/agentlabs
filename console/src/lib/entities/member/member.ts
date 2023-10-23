export type Member = {
	id: string;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	verifiedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};
