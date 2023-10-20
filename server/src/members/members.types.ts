import { JWTPayload } from 'jose';

export type AccessTokenPayload = {
  sub: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  projectId: string;
};

export const isAccessTokenPayload = (
  payload: JWTPayload,
): payload is AccessTokenPayload => {
  return typeof payload.sub === 'string';
};
