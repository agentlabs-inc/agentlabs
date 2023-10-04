export type Member = {
	id: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
	verifiedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};
