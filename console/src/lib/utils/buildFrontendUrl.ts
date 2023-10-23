import { env } from "$env/dynamic/public";
import { validateEnv } from "$lib/utils/validateEnv";
const validatedEnv = validateEnv(env);

if (!validatedEnv) {
	throw new Error("Invalid env");
}

const { PUBLIC_AI_AGENT_DOMAIN } = validatedEnv;

export const buildFrontendUrl = (projectSlug: string) => {
	const protocol = window?.location?.protocol ?? "https:";
	return `${protocol}//${projectSlug}.${PUBLIC_AI_AGENT_DOMAIN}`;
};
