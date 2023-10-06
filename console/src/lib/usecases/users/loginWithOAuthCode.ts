import { UsersService } from "$lib/services/gen-api";
import type { User } from "$lib/entities/user/user";
import dayjs from "dayjs";
import { setUserAuth } from "$lib/stores/auth";

export const loginWithOAuthCode = async (params: {
	providerId: string;
	code: string;
	state: string;
	redirectUri: string;
}) => {
	const { providerId, code, state, redirectUri } = params;
	const result = await UsersService.handleOAuthCallback({
		providerId,
		requestBody: {
			code,
			state,
			redirectUri
		}
	});

	const loggedUser: User = {
		createdAt: new Date(),
		id: result.user.id,
		email: result.user.email,
		fullName: result.user.fullName,
		verifiedAt: dayjs(result.user.verifiedAt).toDate()
	};

	setUserAuth(loggedUser, result.accessToken);

	return loggedUser;
};
