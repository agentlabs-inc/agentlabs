import { User } from '@prisma/client';
import { Request } from 'express';

export const AuthMethods = ['local', 'api-key'] as const;

export type AuthMethod = (typeof AuthMethods)[number];

export interface BaseAuthenticatedRequest extends Request {
  user: User;
  authMethod: AuthMethod;
}

export interface LocalAuthenticatedRequest extends BaseAuthenticatedRequest {
  decodedToken: any;
}

export type AuthenticatedRequest = LocalAuthenticatedRequest;
