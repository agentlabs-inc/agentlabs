import { Module } from '@nestjs/common';
import { AuthMethodsController } from './auth-methods.controller';
import { AuthMethodsService } from './auth-methods.service';

@Module({
  controllers: [AuthMethodsController],
  providers: [AuthMethodsService],
  exports: [AuthMethodsService],
})
export class AuthMethodsModule {}
