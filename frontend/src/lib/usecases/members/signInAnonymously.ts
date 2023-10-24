import type { Member } from "$lib/entities/member/member";
import type { LoginMemberResponseDto } from "$lib/services/gen-api";
import { MembersService } from "$lib/services/gen-api";
import { setMemberAuth } from "$lib/stores/auth";
import dayjs from "dayjs";

export const signInAnonymously = async (projectId: string): Promise<LoginMemberResponseDto> => {
	const result = await MembersService.signInAnonymously({
		projectId
	});

	const loggedMember: Member = {
		createdAt: new Date(),
		id: result.member.id,
		email: result.member.email,
		fullName: result.member.fullName,
		profilePictureUrl: result.member.profilePictureUrl,
		isAnonymous: !result.member.email,
		firstName: result.member.firstName,
		lastName: result.member.lastName,
		verifiedAt: dayjs(result.member.verifiedAt).toDate(),
		updatedAt: dayjs(result.member.updatedAt).toDate()
	};

	setMemberAuth(loggedMember, result.accessToken);

	return result;
};
