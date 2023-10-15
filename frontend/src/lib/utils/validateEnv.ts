import z from "zod";

export const Environment = z.object({
	PUBLIC_APP_HOST: z.string().min(1)
});

export const validateEnv = (env: NodeJS.ProcessEnv) => {
	if (Object.keys(env).length === 0) {
		return null;
	}

	const parsed = Environment.safeParse(env);

	if (!parsed.success) {
		throw new Error(`Environment validation error: ${parsed.error}`);
	}

	return parsed.data;
};
