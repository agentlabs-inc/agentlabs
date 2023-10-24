import type { Member } from "$lib/entities/member/member";
import { MembersService } from "$lib/services/gen-api";
import { setMemberAuth } from "$lib/stores/auth";
import dayjs from "dayjs";

export const verifyPasswordlessEmail = async (params: {
	projectId: string;
	email: string;
	code: string;
}): Promise<Member> => {
	const { projectId, email, code } = params;

	const result = await MembersService.verifyPasswordlessEmail({
		projectId,
		requestBody: {
			email,
			code
		}
	});

	const loggedMember: Member = {
		id: result.member.id,
		createdAt: dayjs(result.member.createdAt).toDate(),
		updatedAt: dayjs(result.member.updatedAt).toDate(),
		email: result.member.email,
		isAnonymous: !result.member.email,
		fullName: result.member.fullName,
		profilePictureUrl: result.member.profilePictureUrl,
		firstName: result.member.firstName,
		lastName: result.member.lastName,
		verifiedAt: dayjs(result.member.verifiedAt).toDate()
	};

	setMemberAuth(loggedMember, result.accessToken);

	return loggedMember;
};
