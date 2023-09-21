import { z } from "zod";
import type { Load } from "@sveltejs/kit";

import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	name: z.string(),
	slug: z.string().min(3).max(20)
});

export const load: Load = async (event) => {
	const form = await superValidate(schema);
	return {
		form
	};
};
