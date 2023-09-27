import { Module } from '@nestjs/common';
import { AgentConnectionManagerGateway } from './agent-connection-manager.gateway';

@Module({
  providers: [AgentConnectionManagerGateway]
})
export class AgentConnectionManagerModule {}
