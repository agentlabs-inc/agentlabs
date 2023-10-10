import { Injectable } from '@nestjs/common';
import { Analytics } from '@segment/analytics-node';
import { InjectTelemetryConfig, TelemetryConfig } from './telemetry.config';
import { TelemetryEvent } from './telemetry.types';

@Injectable()
export class TelemetryService {
  private key?: string;
  private analytics: any;

  constructor(
    @InjectTelemetryConfig() private readonly config: TelemetryConfig,
  ) {
    this.key = config.telemetryKey;

    if (this.key) {
      this.analytics = new Analytics({
        writeKey: this.key,
      });
    }
  }
  public track(params: {
    userId: string;
    event: TelemetryEvent;
    properties?: Record<string, any>;
  }) {
    if (!this.analytics) {
      return;
    }

    return this.analytics.track(params);
  }

  public identify(params: { userId: string; traits?: Record<string, any> }) {
    if (!this.analytics) {
      return;
    }

    return this.analytics.identify({
      userId: params.userId,
      traits: params.traits,
    });
  }

  public group(params: { userId: string; groupId: string }) {
    if (!this.analytics) {
      return;
    }

    return this.analytics.group({
      userId: params.userId,
      groupId: params.groupId,
    });
  }
}
