export type DemoRedirectState = {
	provider: string;
	projectId: string;
	timestamp: number;
	initialOrigin: string;
	redirectUri: string;
};

export const createDemoRedirectState = (params: DemoRedirectState) => {
	return btoa(JSON.stringify(params));
};

const isValidDemoState = (state: any): state is DemoRedirectState => {
	if (typeof state !== "object") {
		return false;
	}

	if (typeof state.redirectUri !== "string") {
		return false;
	}

	if (typeof state.provider !== "string") {
		return false;
	}

	if (typeof state.projectId !== "string") {
		return false;
	}

	if (typeof state.timestamp !== "number") {
		return false;
	}

	if (typeof state.initialOrigin !== "string") {
		return false;
	}

	return true;
};

export const parseDemoRedirectState = (state: string): DemoRedirectState => {
	const parsed = JSON.parse(atob(state));

	if (!isValidDemoState(parsed)) {
		throw new Error(
			`Invalid state. Please try again or configure your OAuth provider from the console.`
		);
	}
	return parsed;
};
