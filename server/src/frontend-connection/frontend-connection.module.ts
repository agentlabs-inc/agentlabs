import { Module } from '@nestjs/common';
import { AgentChatModule } from 'src/agent-chat/agent-chat.module';
import { AgentConnectionManagerModule } from 'src/agent-connection-manager/agent-connection-manager.module';
import { AgentsModule } from 'src/agents/agents.module';
import { FrontendConnectionManagerModule } from 'src/frontend-connection-manager/frontend-connection-manager.module';
import { MembersModule } from 'src/members/members.module';
import { FrontendConnectionGateway } from './frontend-connection.gateway';

@Module({
  imports: [
    AgentConnectionManagerModule,
    FrontendConnectionManagerModule,
    AgentChatModule,
    AgentsModule,
    MembersModule,
  ],
  providers: [FrontendConnectionGateway],
})
export class FrontendConnectionModule {}
