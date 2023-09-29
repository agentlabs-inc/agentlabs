import { Module } from '@nestjs/common';
import { AgentConnectionManagerModule } from 'src/agent-connection-manager/agent-connection-manager.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { FrontendConnectionGateway } from './frontend-connection.gateway';

@Module({
  imports: [AgentConnectionManagerModule, FrontendConnectionManagerModule],
  providers: [FrontendConnectionGateway],
})
export class FrontendConnectionModule {}
