import { SetMetadata } from '@nestjs/common';
import { AuthMethod } from './iam.types';

export const REQUIRE_AUTH_METHOD_METADATA_KEY = 'require-auth';

export const RequireAuthMethod = (method: AuthMethod) =>
  SetMetadata(REQUIRE_AUTH_METHOD_METADATA_KEY, method);
