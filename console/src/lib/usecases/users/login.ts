import { UsersService } from "$lib/services/gen-api";
import type { LoginUserDto } from "$lib/services/gen-api/models/LoginUserDto";
import type { User } from "$lib/entities/user/user";
import dayjs from "dayjs";
import { setUserAuth } from "$lib/stores/auth";

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
		verifiedAt: dayjs(result.user.verifiedAt).toDate()
	};

	setUserAuth(loggedUser, result.accessToken);

	return loggedUser;
};
