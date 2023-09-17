import { UsersApi } from "$lib/services/typescript-client/src";
import type { RegisterUserDto } from "$lib/services/typescript-client/src";

import { commonApiConfig } from "$lib/usecases/common.config";
import type { User } from "$lib/entities/user/user";

export const registerUser = async (user: RegisterUserDto): Promise<User> => {
	const usersApi = new UsersApi(commonApiConfig);

	const result = await usersApi.register({
		registerUserDto: {
			email: user.email,
			name: user.name,
			password: user.password
		}
	});

	console.log("Got result");

	return {
		createdAt: new Date(),
		id: result.id,
		email: result.email,
		name: result.name
	};
};
