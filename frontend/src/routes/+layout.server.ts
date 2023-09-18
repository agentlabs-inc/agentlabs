import type { ServerLoad } from "@sveltejs/kit";
import type { MainLayoutContext } from "./types";

const waitForDelayMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const load: ServerLoad = async (): Promise<MainLayoutContext> => {
	return {
		lazy: {
			context: new Promise((resolve) => {
				return waitForDelayMs(1000).then(() => {
					resolve({
						tenantName: "AgentLabs Team",
						allowedSignInMethods: ["passwordless-email", "google", "github", "gitlab"]
					});
				});
			})
		}
	};
};
