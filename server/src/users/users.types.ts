import { PasswordHashConfig } from '@prisma/client';

export type CreatePasswordHashConfig =
  | PasswordHashConfig
  | Omit<PasswordHashConfig, 'createdAt' | 'updatedAt' | 'id' | 'userId'>;
