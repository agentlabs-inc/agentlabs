import { Module } from '@nestjs/common';
import { SdkSecretsController } from './sdk-secrets.controller';
import { SdkSecretsService } from './sdk-secrets.service';

@Module({
  controllers: [SdkSecretsController],
  providers: [SdkSecretsService],
  exports: [SdkSecretsService],
})
export class SdkSecretsModule {}
