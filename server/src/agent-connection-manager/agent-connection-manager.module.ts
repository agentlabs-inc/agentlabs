import { Module } from '@nestjs/common';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { AgentConnectionManagerService } from './agent-connection-manager.service';

@Module({
  imports: [FrontendConnectionManagerModule],
  providers: [AgentConnectionManagerService],
  exports: [AgentConnectionManagerService],
})
export class AgentConnectionManagerModule {}
