import type { Member } from "$lib/entities/member/member";
import { MembersService } from "$lib/services/gen-api";
import { setMemberAuth } from "$lib/stores/auth";
import dayjs from "dayjs";

export const loginWithOAuthCode = async (params: {
	providerId: string;
	code: string;
	state: string;
	redirectUri: string;
	projectId: string;
}) => {
	const { projectId, providerId, code, state, redirectUri } = params;
	const result = await MembersService.handleOAuthCallback({
		providerId: providerId.toUpperCase(),
		requestBody: {
			code,
			state,
			redirectUri,
			projectId
		}
	});

	const loggedMember: Member = {
		createdAt: new Date(),
		id: result.member.id,
		email: result.member.email,
		fullName: result.member.fullName,
		profilePictureUrl: result.member.profilePictureUrl,
		firstName: result.member.firstName,
		lastName: result.member.lastName,
		verifiedAt: dayjs(result.member.verifiedAt).toDate(),
		updatedAt: dayjs(result.member.updatedAt).toDate()
	};

	setMemberAuth(loggedMember, result.accessToken);

	return loggedMember;
};
