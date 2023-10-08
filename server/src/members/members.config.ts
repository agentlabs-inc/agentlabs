import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

export interface MembersConfig {
  accessTokenSecret: string;
  accessTokenExpirationTime: string;
  authCodeExpirationDelayInMinutes: number;
  googleDemoClientId: string;
  googleDemoClientSecret: string;
}

export const membersConfig = registerAs<MembersConfig>(
  'MembersConfig',
  (): MembersConfig => {
    const env = validateEnv(process.env);

    return {
      accessTokenSecret: env.MEMBERS_ACCESS_TOKEN_SECRET,
      accessTokenExpirationTime: '24h',
      authCodeExpirationDelayInMinutes:
        env.MEMBERS_AUTH_CODE_EXPIRATION_DELAY_IN_MINUTES,
      googleDemoClientId: env.MEMBERS_DEMO_OAUTH_GOOGLE_CLIENT_ID,
      googleDemoClientSecret: env.MEMBERS_DEMO_OAUTH_GOOGLE_CLIENT_SECRET,
    };
  },
);

export const InjectMembersConfig = () => Inject(membersConfig.KEY);
