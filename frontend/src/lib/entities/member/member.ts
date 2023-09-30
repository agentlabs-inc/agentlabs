export type Member = {
	id: string;
	firstName: string | null;
	lastName: string | null;
	verifiedAt: Date | null;
	email: string;
	createdAt: Date;
	updatedAt: Date;
};
