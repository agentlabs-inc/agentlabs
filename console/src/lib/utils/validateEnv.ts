import z from "zod";

export const Environment = z.object({
	PUBLIC_AI_AGENT_DOMAIN: z.string().min(1),
	PUBLIC_OAUTH_GOOGLE_CLIENT_ID: z.string().min(1),
	PUBLIC_TELEMETRY_KEY: z.string().optional(),
	PUBLIC_DISCORD_URL: z.string().optional(),
	PUBLIC_INTERCOM_APP_ID: z.string().optional(),
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
