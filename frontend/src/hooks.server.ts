import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/__/auth/handler")) {
		console.log("This will be used as auth handler from frontend");
	}

	const response = await resolve(event);
	return response;
};
