import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

// TODO: Implement MailerModule for user email validation
@Module({
  providers: [MailerService],
})
export class MailerModule {}
