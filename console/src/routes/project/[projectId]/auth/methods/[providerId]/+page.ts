import type { Load } from "@sveltejs/kit";
import { z } from "zod";

import { fetchAuthMethod } from "$lib/usecases/auth-methods/fetchAuthMethod";
import { superValidate } from "sveltekit-superforms/server";

const schema = z.object({
	clientId: z.string(),
	clientSecret: z.string()
});

export const ssr = false;

export const load: Load = async (event) => {
	const { projectId, providerId } = event.params;

	const method = await fetchAuthMethod(projectId!, providerId!);

	if (!method) {
		throw new Error("This auth method is not available.");
	}

	const form = await superValidate(
		{
			clientId: method.clientId ?? "",
			clientSecret: method.clientSecret ?? ""
		},
		schema
	);

	return {
		form,
		authMethod: method,
		isLoaded: true
	};
};
