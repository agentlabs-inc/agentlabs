import { Module } from '@nestjs/common';
import { GoogleService } from './google/google.service';

@Module({
  providers: [GoogleService],
  exports: [GoogleService],
})
export class OauthProvidersModule {}
