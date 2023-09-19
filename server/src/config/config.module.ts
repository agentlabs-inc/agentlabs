import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { usersConfig } from '../users/users.config';
import { validateEnv } from './validate-env';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [usersConfig],
      cache: true,
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
})
export class ConfigModule {}
