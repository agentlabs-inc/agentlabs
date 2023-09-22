import { PasswordHashConfig } from '@prisma/client';
import { JWTPayload } from 'jose';

export type CreatePasswordHashConfig =
  | PasswordHashConfig
  | Omit<PasswordHashConfig, 'createdAt' | 'updatedAt' | 'id' | 'userId'>;

export type AccessTokenPayload = {
  sub: string;
};

export const isAccessTokenPayload = (
  payload: JWTPayload,
): payload is AccessTokenPayload => {
  return typeof payload.sub === 'string';
};
