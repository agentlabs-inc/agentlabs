import type { Load } from "@sveltejs/kit";
import { z } from "zod";

import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	email: z.string().email()
});

export const load: Load = async (event) => {
	const form = await superValidate(schema);
	return {
		form
	};
};
