const basePath = "/console";

export const homeRoute = {
	path: () => `${basePath}/project/overview`
};

export const overviewRoute = {
	path: (projectId: string) => `${basePath}/project/${projectId}/overview`
};

export const authSettingsRoute = {
	path: (projectId: string) => `${basePath}/project/${projectId}/auth`
};

export const settingsRoute = {
	path: (projectId: string) => `${basePath}/project/${projectId}/settings`
};

export const loginRoute = {
	path: () => `${basePath}/login`
};

export const registerRoute = {
	path: () => `${basePath}/register`
};

export const forgotPasswordRoute = {
	path: () => `${basePath}/forgot-password`
};

export const onboardingRoute = {
	path: () => `${basePath}/onboarding/new`
};

export const projectOnboardingAuthMethodRoute = {
	path: (projectId: string) => `${basePath}/onboarding/project/${projectId}/auth`
};

export const projectOnboardingUseApplicationRoute = {
	path: (projectId: string) => `${basePath}/onboarding/project/${projectId}/ready`
};

export const projectOverviewRoute = {
	path: (projectId: string) => `${basePath}/project/${projectId}/overview`
};

export const logoutRoute = {
	path: () => `${basePath}/logout`
};

export const agentOverviewRoute = {
	path: (projectId: string, agentId: string) =>
		`${basePath}/project/${projectId}/agent/${agentId}`
};
