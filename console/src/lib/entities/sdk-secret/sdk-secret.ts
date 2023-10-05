export type SdkSecret = {
	id: string;
	description: string | null;
	hash: string;
	preview: string;
	createdAt: Date;
	updatedAt: Date;
	projectId: string;
};

export type SanitizedSdkSecret = Omit<SdkSecret, "hash">;
