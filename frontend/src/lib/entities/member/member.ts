export type Member = {
	id: string;
	fullName: string | null;
	firstName: string | null;
	lastName: string | null;
	profilePictureUrl: string | null;
	isAnonymous: boolean;
	verifiedAt: Date | null;
	email: string | null;
	createdAt: Date;
	updatedAt: Date;
};
