import { Module } from '@nestjs/common';
import { AgentConnectionManagerGateway } from './agent-connection-manager.gateway';
import { AgentConnectionManagerService } from './agent-connection-manager.service';

@Module({
  providers: [AgentConnectionManagerGateway, AgentConnectionManagerService]
})
export class AgentConnectionManagerModule {}
