import type { User } from "$lib/entities/user/user";
import { UsersService } from "$lib/services/gen-api";
import type { LoginUserDto } from "$lib/services/gen-api/models/LoginUserDto";
import { setUserAuth } from "$lib/stores/auth";
import dayjs from "dayjs";

export const loginUser = async (user: LoginUserDto): Promise<User> => {
	const result = await UsersService.login({
		requestBody: {
			email: user.email,
			password: user.password
		}
	}).catch((err) => {
		console.error("Error logging in", err);
		throw err;
	});

	const loggedUser: User = {
		createdAt: new Date(),
		id: result.user.id,
		email: result.user.email,
		fullName: result.user.fullName,
		profilePictureUrl: result.user.profilePictureUrl,
		verifiedAt: dayjs(result.user.verifiedAt).toDate()
	};

	setUserAuth(loggedUser, result.accessToken);

	return loggedUser;
};
