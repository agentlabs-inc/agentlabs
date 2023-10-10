import { Module } from '@nestjs/common';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { AuthMethodsController } from './auth-methods.controller';
import { AuthMethodsService } from './auth-methods.service';

@Module({
  controllers: [AuthMethodsController],
  providers: [AuthMethodsService],
  exports: [AuthMethodsService],
  imports: [TelemetryModule],
})
export class AuthMethodsModule {}
