import { Member, User } from '@prisma/client';
import { Request } from 'express';
import { SdkUser } from './server-sdk-auth/server-sdk-auth.types';

export const AuthMethods = [
  'server-sdk',
  'member-token',
  'user-token',
] as const;

export type AuthMethod = (typeof AuthMethods)[number];

export interface BaseAuthenticatedRequest extends Request {
  authMethod: AuthMethod;
}

export interface MemberAuthenticatedRequest extends BaseAuthenticatedRequest {
  authMethod: 'member-token';
  member: Member;
}

export interface UserAuthenticatedRequest extends BaseAuthenticatedRequest {
  authMethod: 'user-token';
  user: User;
}

export interface ServerSdkAuthenticatedRequest
  extends BaseAuthenticatedRequest {
  authMethod: 'server-sdk';
  sdkUser: SdkUser;
}

export type AuthenticatedRequest =
  | MemberAuthenticatedRequest
  | UserAuthenticatedRequest
  | ServerSdkAuthenticatedRequest;
