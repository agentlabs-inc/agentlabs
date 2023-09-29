import { Module } from '@nestjs/common';
import { FrontendConnectionManagerService } from './frontend-connection-manager.service';

@Module({
  imports: [],
  providers: [FrontendConnectionManagerService],
  exports: [FrontendConnectionManagerService],
})
export class FrontendConnectionManagerModule {}
