import { Module } from '@nestjs/common';
import { MailerModule } from '../mailer/mailer.module';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [MailerModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
