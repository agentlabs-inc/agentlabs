const basePath = "";

export const homeRoute = {
	path: () => `${basePath}/project/overview`
};

export const selectAgentRoute = {
	path: () => `${basePath}/agents`
};

export const agentChatRoute = {
	path: () => `${basePath}/main`
};

export const logoutRoute = {
	path: () => `${basePath}/logout`
};
