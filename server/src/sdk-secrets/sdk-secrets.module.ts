import { Module } from '@nestjs/common';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { SdkSecretsController } from './sdk-secrets.controller';
import { SdkSecretsService } from './sdk-secrets.service';

@Module({
  imports: [TelemetryModule],
  controllers: [SdkSecretsController],
  providers: [SdkSecretsService],
  exports: [SdkSecretsService],
})
export class SdkSecretsModule {}
