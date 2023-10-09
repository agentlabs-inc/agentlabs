export type User = {
	id: string;
	fullName: string;
	profilePictureUrl: string | null;
	verifiedAt: Date | null;
	email: string;
	createdAt: Date;
};
