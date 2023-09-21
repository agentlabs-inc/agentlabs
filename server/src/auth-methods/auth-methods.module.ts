import { Module } from '@nestjs/common';
import { AuthMethodsService } from './auth-methods.service';
import { AuthMethodsController } from './auth-methods.controller';

@Module({
  controllers: [AuthMethodsController],
  providers: [AuthMethodsService],
})
export class AuthMethodsModule {}
