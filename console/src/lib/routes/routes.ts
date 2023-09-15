export const overviewRoute = {
	path: () => "/main"
};

export const authSettingsRoute = {
	path: () => "/auth/settings"
};

export const settingsRoute = {
	path: () => "/settings"
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
