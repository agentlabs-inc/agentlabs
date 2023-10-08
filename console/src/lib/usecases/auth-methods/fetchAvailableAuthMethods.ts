import GithubIcon from "$lib/components/auth/GithubIcon.svelte";
import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
import MicrosoftIcon from "$lib/components/auth/MicrosoftIcon.svelte";
import type { AuthMethodListItem } from "$lib/entities/auth-method/auth-method-list-item";
import { AuthMethodsService } from "$lib/services/gen-api";
import { ChatBubbleLeft, Envelope, EyeSlash, Key } from "svelte-hero-icons";

export type fetchAvailableAuthMethodsResponse = {
	builtIn: AuthMethodListItem[];
	oauth: AuthMethodListItem[];
};
export const fetchAvailableAuthMethods = async (
	projectId: string
): Promise<fetchAvailableAuthMethodsResponse> => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const methods = await AuthMethodsService.listAuthMethods({
		projectId
	});

	const builtInMethods: AuthMethodListItem[] = [
		{
			id: "passwordless-email",
			name: "Passwordless email",
			value: "PASSWORDLESS_EMAIL",
			heroIcon: Envelope,
			componentIcon: null,
			available: true,
			statusLabel: "ACTIVE",
			isEnabled: false
		},
		{
			id: "anonymous",
			name: "Anonymous",
			value: "ANONYMOUS",
			heroIcon: EyeSlash,
			componentIcon: null,
			available: false,
			statusLabel: "COMING SOON",
			isEnabled: false
		},
		{
			id: "email-and-password",
			name: "Email and password",
			value: "EMAIL_AND_PASSWORD",
			heroIcon: Key,
			componentIcon: null,
			available: false,
			statusLabel: "COMING SOON",
			isEnabled: false
		},
		{
			id: "SMS",
			name: "SMS",
			value: "SMS",
			heroIcon: ChatBubbleLeft,
			componentIcon: null,
			available: false,
			statusLabel: "COMING SOON",
			isEnabled: false
		}
	].map((method) => {
		const foundMethod = methods.items.find((m) => m.provider === method.value);

		if (foundMethod) {
			return {
				...method,
				isEnabled: foundMethod.isEnabled,
				statusLabel: foundMethod.isEnabled ? "ENABLED" : "DISABLED"
			};
		}

		return method;
	});

	const oauthMethods: AuthMethodListItem[] = [
		{
			id: "google",
			name: "Google / Gmail",
			value: "GOOGLE",
			heroIcon: null,
			componentIcon: GoogleIcon,
			available: true,
			statusLabel: "ACTIVE",
			isEnabled: false
		},
		{
			id: "gitlab",
			name: "Gitlab",
			value: "GITLAB",
			heroIcon: null,
			componentIcon: GitlabIcon,
			available: false,
			statusLabel: "COMING SOON",
			isEnabled: false
		},
		{
			id: "github",
			name: "GitHub",
			value: "GITHUB",
			heroIcon: null,
			componentIcon: GithubIcon,
			available: false,
			statusLabel: "COMING SOON",
			isEnabled: false
		},
		{
			id: "microsoft",
			name: "Microsoft",
			value: "MICROSOFT",
			heroIcon: null,
			componentIcon: MicrosoftIcon,
			available: false,
			statusLabel: "COMING SOON",
			isEnabled: false
		}
	].map((method) => {
		const foundMethod = methods.items.find((m) => m.provider === method.value);

		if (foundMethod) {
			return {
				...method,
				isEnabled: foundMethod.isEnabled,
				statusLabel: foundMethod.isEnabled ? "ENABLED" : "DISABLED"
			};
		}

		return method;
	});

	return {
		builtIn: builtInMethods,
		oauth: oauthMethods
	};
};
