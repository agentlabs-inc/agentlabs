import { UsersService } from "$lib/services/gen-api";
import type { LoginUserDto } from "$lib/services/gen-api/models/LoginUserDto";
import type { User } from "$lib/entities/user/user";
import dayjs from "dayjs";
import { login } from "$lib/context/auth.context";

export const loginUser = async (user: LoginUserDto): Promise<User> => {
	const result = await UsersService.login({
		requestBody: {
			email: user.email,
			password: user.password
		}
	});

	console.log("Got result", result);

	const loggedUser: User = {
		createdAt: new Date(),
		id: result.user.id,
		email: result.user.email,
		fullName: result.user.fullName,
		verifiedAt: dayjs(result.user.verifiedAt).toDate()
	};

	login(loggedUser, result.accessToken);

	return loggedUser;
};
