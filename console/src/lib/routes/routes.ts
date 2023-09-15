export const homeRoute = {
	path: () => "/project/overview"
};

export const overviewRoute = {
	path: () => `/project/overview`
};

export const authSettingsRoute = {
	path: () => "/project/auth"
};

export const settingsRoute = {
	path: () => "/project/settings"
};

export const loginRoute = {
	path: () => "/login"
};

export const registerRoute = {
	path: () => "/register"
};

export const forgotPasswordRoute = {
	path: () => "/forgot-password"
};

export const onboardingRoute = {
	path: () => "/onboarding"
};

export const projectOnboardingRoute = {
	path: (projectId: string) => `/project/${projectId}/onboarding`
};
