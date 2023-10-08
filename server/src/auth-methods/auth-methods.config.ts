import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

export interface AuthMethodsConfig {
  authMethodSecretEncryptionKey: string;
  authMethodSecretEncryptionAlgorithm: string;
}

export const authMethodsConfig = registerAs<AuthMethodsConfig>(
  'AuthMethodsConfig',
  (): AuthMethodsConfig => {
    const env = validateEnv(process.env);

    return {
      authMethodSecretEncryptionKey: env.AES_ENCRYPTION_KEY,
      authMethodSecretEncryptionAlgorithm: 'aes-256-cbc',
    };
  },
);

export const InjectAuthMethodsConfig = () => Inject(authMethodsConfig.KEY);
