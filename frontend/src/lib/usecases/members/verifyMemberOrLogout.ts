import { goto } from "$app/navigation";
import { logoutRoute } from "$lib/routes/routes";
import { MembersService } from "$lib/services/gen-api";

export const verifyMemberOrLogout = async () => {
	try {
		const member = await MembersService.whoami();
	} catch (e: any) {
		if (e.status === 401) {
			await goto(logoutRoute.path());
		} else {
			console.error(e);
		}
	}
};
