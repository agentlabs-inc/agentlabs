import { Module } from '@nestjs/common';
import { AuthMethodsModule } from '../auth-methods/auth-methods.module';
import { MailerModule } from '../mailer/mailer.module';
import { OauthProvidersModule } from '../oauth-providers/oauth-providers.module';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [MailerModule, OauthProvidersModule, AuthMethodsModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
