import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LocalAuthMiddleware } from './local-auth/local-auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { IamGuard } from './iam.guard';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: IamGuard,
    },
  ],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocalAuthMiddleware).forRoutes('*');
  }
}
