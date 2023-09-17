import { Configuration } from "$lib/services/typescript-client/src";

export const commonApiConfig = new Configuration({
	// TODO: Check with Aurel how we wants to handle this.
	basePath: "http://localhost:3001"
});
