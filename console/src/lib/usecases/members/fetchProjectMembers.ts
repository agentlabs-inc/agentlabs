import { MembersService } from "$lib/services/gen-api";
import dayjs from "dayjs";
import type { Member } from "$lib/entities/member/member";

export const fetchProjectMembers = async (params: {
	projectId: string;
	page: number;
}): Promise<{
	items: Member[];
	totalCount: number;
}> => {
	const { projectId, page } = params;

	await new Promise((resolve) => setTimeout(resolve, 1000));

	const memberResult = await MembersService.listMembers({
		projectId,
		page,
		limit: 500
	});

	return {
		totalCount: memberResult.totalCount,
		items: memberResult.items.map((member) => ({
			id: member.id,
			email: member.email,
			firstName: member.firstName,
			lastName: member.lastName,
			createdAt: dayjs(member.createdAt).toDate(),
			updatedAt: dayjs(member.updatedAt).toDate(),
			verifiedAt: member.verifiedAt ? dayjs(member.verifiedAt).toDate() : null
		}))
	};
};
