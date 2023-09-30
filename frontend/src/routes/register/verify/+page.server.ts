import type { Load } from "@sveltejs/kit";
import { z } from "zod";

import { registerRoute } from "$lib/routes/routes";
import { redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	code: z.string()
});

export const load: Load = async (event) => {
	const form = await superValidate(schema);

	const email = event.url.searchParams.get("email");

	if (!email) {
		throw redirect(307, registerRoute.path());
	}

	return {
		form,
		email
	};
};
