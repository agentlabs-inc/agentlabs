import { Module } from '@nestjs/common';
import { MailerModule } from '../mailer/mailer.module';
import { OauthProvidersModule } from '../oauth-providers/oauth-providers.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [MailerModule, OauthProvidersModule],
})
export class UsersModule {}
