import { Module } from '@nestjs/common';
import { AgentConnectionManagerModule } from 'src/agent-connection-manager/agent-connection-manager.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { AgentConnectionGateway } from './agent-connection.gateway';

@Module({
  imports: [AgentConnectionManagerModule, FrontendConnectionManagerModule],
  providers: [AgentConnectionGateway],
})
export class AgentConnectionModule {}
