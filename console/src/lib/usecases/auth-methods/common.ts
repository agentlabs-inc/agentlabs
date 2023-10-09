import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
import type { SvelteComponent } from "svelte";
import type { IconSource } from "svelte-hero-icons";
import { Envelope } from "svelte-hero-icons";

export type AvailableAuthMethod = {
	name: string;
	providerId: string;
	heroIcon: IconSource | null;
	componentIcon: typeof SvelteComponent<any, any, any> | null;
	type: "EMAIL" | "OAUTH2";
};

export const availableAuthMethods: AvailableAuthMethod[] = [
	{
		name: "Passwordless email",
		providerId: "PASSWORDLESS_EMAIL",
		heroIcon: Envelope,
		componentIcon: null,
		type: "EMAIL"
	},
	{
		name: "Google / Gmail",
		providerId: "GOOGLE",
		heroIcon: null,
		componentIcon: GoogleIcon,
		type: "OAUTH2"
	}
];
