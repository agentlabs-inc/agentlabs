const basePath = "/console";

export const homeRoute = {
	path: () => `${basePath}/project/overview`
};

export const overviewRoute = {
	path: () => `${basePath}/project/overview`
};

export const authSettingsRoute = {
	path: () => `${basePath}/project/auth`
};

export const settingsRoute = {
	path: () => `${basePath}/project/settings`
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
	path: () => `${basePath}/onboarding`
};

export const projectOnboardingRoute = {
	path: (projectId: string) => `${basePath}/project/${projectId}/onboarding`
};
