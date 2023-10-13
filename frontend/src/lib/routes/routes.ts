const basePath = "";

export const homeRoute = {
	path: () => `${basePath}/chat`
};

export const agentChatRoute = {
	path: () => `${basePath}/chat`
};

export const chatConversationRoute = {
	path: (conversationId: string) => `${basePath}/chat/c/${conversationId}`
};

export const logoutRoute = {
	path: () => `${basePath}/logout`
};

export const loginRoute = {
	path: () => `${basePath}/login`
};

export const registerRoute = {
	path: () => `${basePath}/register`
};

export const verifyPasswordlessEmailRoute = {
	path: (email: string) => `${basePath}/register/verify?email=${email}`
};

export const projectNotFoundRoute = {
	path: () => `${basePath}/project-not-found`
};
