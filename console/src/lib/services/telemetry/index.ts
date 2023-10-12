import { env } from "$env/dynamic/public";
import type { PageCategory } from "$lib/services/telemetry/types";
import { validateEnv } from "$lib/utils/validateEnv";
import type { EventProperties, UserTraits } from "@segment/analytics-next";
import { AnalyticsBrowser } from "@segment/analytics-next";

export class TelemetryService {
	private analytics: AnalyticsBrowser | null = null;

	constructor(private key: string | null | undefined) {
		this.key = key;

		console.log("Initializing TelemetryService");

		if (this.key) {
			this.analytics = AnalyticsBrowser.load({ writeKey: this.key });
		}
	}

	public identify(userId: string, traits?: UserTraits) {
		if (!this.analytics) {
			return;
		}

		return this.analytics.identify(userId, traits);
	}

	public track(event: string, properties?: EventProperties) {
		if (!this.analytics) {
			return;
		}

		return this.analytics.track(event, properties);
	}

	public page(category: PageCategory, name: string, properties?: EventProperties) {
		if (!this.analytics) {
			return;
		}

		return this.analytics.page(category, name, properties);
	}
}

const validatedEnv = validateEnv(env);

export const telemetryService = new TelemetryService(validatedEnv?.PUBLIC_TELEMETRY_KEY);
