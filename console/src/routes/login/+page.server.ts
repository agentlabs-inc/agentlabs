import { z } from "zod";
import type { Load } from "@sveltejs/kit";

import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const load: Load = async (event) => {
	const form = await superValidate(schema);
	return {
		form
	};
};
