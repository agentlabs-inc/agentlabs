import { PasswordHashConfig } from '@prisma/client';

export type CreatePasswordHashConfig = Omit<
  PasswordHashConfig,
  'createdAt' | 'updatedAt' | 'id' | 'userId'
>;
