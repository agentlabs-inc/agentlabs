import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

export interface UsersConfig {
  accessTokenSecret: string;
  accessTokenExpirationTime: string;
  defaultOrganizationName: string;
  oauthGoogleClientId: string;
  oauthGoogleClientSecret: string;
}

export const usersConfig = registerAs<UsersConfig>(
  'UsersConfig',
  (): UsersConfig => {
    const env = validateEnv(process.env);

    return {
      accessTokenSecret: env.USERS_ACCESS_TOKEN_SECRET,
      accessTokenExpirationTime: '3h',
      defaultOrganizationName: 'My organization',
      oauthGoogleClientId: env.USERS_OAUTH_GOOGLE_CLIENT_ID,
      oauthGoogleClientSecret: env.USERS_OAUTH_GOOGLE_CLIENT_SECRET,
    };
  },
);

export const InjectUsersConfig = () => Inject(usersConfig.KEY);
