import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

export interface TelemetryConfig {
  telemetryKey?: string;
}

export const telemetryConfig = registerAs<TelemetryConfig>(
  'TelemetryConfig',
  (): TelemetryConfig => {
    const env = validateEnv(process.env);

    return {
      telemetryKey: env.SECRET_TELEMETRY_KEY,
    };
  },
);

export const InjectTelemetryConfig = () => Inject(telemetryConfig.KEY);
