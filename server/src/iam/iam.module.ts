import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MembersModule } from 'src/members/members.module';
import { UsersModule } from 'src/users/users.module';
import { IamGuard } from './iam.guard';
import { MemberAuthMiddleware } from './member-auth/member-auth.middleware';
import { ServerSdkAuthMiddleware } from './server-sdk-auth/server-sdk-auth.middleware';
import { UserAuthMiddleware } from './user-auth/user-auth.middleware';

@Module({
  imports: [UsersModule, MembersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: IamGuard,
    },
  ],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes('*');
    consumer.apply(MemberAuthMiddleware).forRoutes('*');
    consumer.apply(ServerSdkAuthMiddleware).forRoutes('*');
  }
}
