export type UserConfig = {
	id: string;
	fullName: string;
	verifiedAt: Date | null;
	email: string;
	createdAt: Date;
	organizationCount: number;
	defaultOrganizationId: string | null;
	defaultProjectId: string | null;
	projectCount: number;
	projectCreatedCount: number;
};
