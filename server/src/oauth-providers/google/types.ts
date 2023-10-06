export type GoogleUserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name?: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

export type TokenResponse = {
  token_type: string;
  scope: string;
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type RefreshTokenResponse = {
  token_type: string;
  scope: string;
  id_token: string;
  access_token: string;
  expires_in: number;
};

export const isGoogleUserInfo = (userInfo: any): userInfo is GoogleUserInfo => {
  return (
    typeof userInfo.sub === 'string' &&
    typeof userInfo.name === 'string' &&
    typeof userInfo.given_name === 'string' &&
    typeof userInfo.picture === 'string' &&
    typeof userInfo.email === 'string' &&
    typeof userInfo.email_verified === 'boolean' &&
    typeof userInfo.locale === 'string'
  );
};
