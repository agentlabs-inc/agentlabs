import { AuthMethodsService } from "$lib/services/gen-api";
import { availableAuthMethods } from "$lib/usecases/auth-methods/common";
import type { SvelteComponent } from "svelte";
import type { IconSource } from "svelte-hero-icons";

export type FetchAuthMethodResponse = {
	name: string;
	providerId: string;
	heroIcon: IconSource | null;
	componentIcon: typeof SvelteComponent | null;
	isEnabled: boolean;
	clientId: string | null;
	clientSecret: string | null;
	scopes: string[];
	type: string;
};

export const fetchAuthMethod = async (
	projectId: string,
	providerId: string
): Promise<FetchAuthMethodResponse> => {
	const availableMethod = availableAuthMethods.find(
		(m) => m.providerId.toLowerCase() === providerId.toLowerCase()
	);

	if (!availableMethod) {
		throw new Error("This auth method is not available.");
	}

	await new Promise((resolve) => setTimeout(resolve, 500));

	const methods = await AuthMethodsService.listAuthMethods({
		projectId
	});

	const method = methods.items.find((m) => m.provider.toLowerCase() === providerId);

	return {
		name: availableMethod.name,
		providerId: availableMethod.providerId,
		heroIcon: availableMethod.heroIcon,
		componentIcon: availableMethod.componentIcon,
		isEnabled: method?.isEnabled ?? false,
		clientId: method?.clientId ?? null,
		clientSecret: method?.clientSecret ?? null,
		scopes: method?.scopes ?? [],
		type: availableMethod.type
	};
};
